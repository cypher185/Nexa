/**
 * Generic SMM panel client. Most providers (JustAnotherPanel, Peakerr,
 * SMMStone, etc.) implement the same form-encoded POST API. We talk to that
 * shape from the server only.
 */

export type SmmPanelService = {
  service: string;
  name: string;
  type?: string;
  category?: string;
  rate: string;
  min: string;
  max: string;
  dripfeed?: boolean;
  refill?: boolean;
  cancel?: boolean;
  description?: string;
};

export type SmmPanelStatus = {
  status?: string;
  charge?: string;
  start_count?: string;
  remains?: string;
  currency?: string;
  error?: string;
};

async function panelCall<T>(
  apiUrl: string,
  apiKey: string,
  params: Record<string, string>,
): Promise<T> {
  const body = new URLSearchParams({ key: apiKey, ...params });
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`SMM panel returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    throw new Error(`SMM panel error ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  }
  if (json && typeof json === "object" && "error" in json && json.error) {
    throw new Error(`SMM panel error: ${json.error}`);
  }
  return json as T;
}

export function smmPanel(apiUrl: string, apiKey: string) {
  return {
    services: () => panelCall<SmmPanelService[]>(apiUrl, apiKey, { action: "services" }),
    balance: () => panelCall<{ balance: string; currency: string }>(apiUrl, apiKey, { action: "balance" }),
    addOrder: (service: string, link: string, quantity: number) =>
      panelCall<{ order: number | string }>(apiUrl, apiKey, {
        action: "add",
        service,
        link,
        quantity: String(quantity),
      }),
    status: (orderIds: string[]) => {
      if (orderIds.length === 1) {
        return panelCall<SmmPanelStatus>(apiUrl, apiKey, {
          action: "status",
          order: orderIds[0],
        }).then((r) => ({ [orderIds[0]]: r }) as Record<string, SmmPanelStatus>);
      }
      return panelCall<Record<string, SmmPanelStatus>>(apiUrl, apiKey, {
        action: "status",
        orders: orderIds.join(","),
      });
    },
  };
}

/** Normalize panel status string → internal smm_order_status enum value. */
export function normalizeStatus(raw: string | undefined): string {
  const s = (raw ?? "").toLowerCase().trim();
  if (s === "pending") return "pending";
  if (s === "in progress" || s === "processing") return "in_progress";
  if (s === "completed" || s === "complete") return "completed";
  if (s === "partial") return "partial";
  if (s === "canceled" || s === "cancelled") return "canceled";
  if (s === "refunded") return "refunded";
  if (s === "fail" || s === "failed" || s === "error") return "failed";
  return "in_progress";
}

/** USD per-1000 → NGN kobo per 1 unit (rate × qty / 1000). */
export function priceKobo(
  rateUsdPer1000: number,
  markupPct: number,
  qty: number,
  ngnPerUsd: number,
): number {
  const usdCost = (rateUsdPer1000 * qty) / 1000;
  const ngnCost = usdCost * ngnPerUsd * (1 + markupPct / 100);
  return Math.ceil(ngnCost * 100); // kobo
}
