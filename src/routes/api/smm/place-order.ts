import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";
import { authUser, getNgnPerUsd } from "@/lib/smm/auth.server";
import { smmPanel, priceKobo } from "@/lib/smm/panel-client.server";

const schema = z.object({
  service_id: z.string().uuid(),
  link: z.string().url().max(2000),
  quantity: z.number().int().positive().max(10_000_000),
});

export const Route = createFileRoute("/api/smm/place-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { user, error } = await authUser(request);
        if (error || !user) return error ?? Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

        const body = await request.json().catch(() => ({}));
        const parsed = schema.safeParse(body);
        if (!parsed.success) return Response.json({ error: "INVALID_BODY" }, { status: 400 });

        const admin = getSupabaseAdmin();
        const { data: svc } = await admin
          .from("smm_services")
          .select("*, smm_providers(id, api_url, api_key, enabled)")
          .eq("id", parsed.data.service_id)
          .eq("enabled", true)
          .eq("visible", true)
          .maybeSingle();
        if (!svc) return Response.json({ error: "SERVICE_NOT_FOUND" }, { status: 404 });
        const provider = (svc as any).smm_providers;
        if (!provider?.enabled) return Response.json({ error: "PROVIDER_DISABLED" }, { status: 503 });

        const qty = parsed.data.quantity;
        if (qty < svc.min_qty || qty > svc.max_qty) {
          return Response.json(
            { error: "QUANTITY_OUT_OF_RANGE", min: svc.min_qty, max: svc.max_qty },
            { status: 400 },
          );
        }

        const ngnPerUsd = await getNgnPerUsd();
        const charge = priceKobo(Number(svc.rate_usd_per_1000), Number(svc.markup_pct), qty, ngnPerUsd);
        const providerUsd = (Number(svc.rate_usd_per_1000) * qty) / 1000;

        // Check wallet balance up front for a nicer error
        const { data: wallet } = await admin
          .from("wallets")
          .select("balance_kobo")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!wallet || wallet.balance_kobo < charge) {
          return Response.json({ error: "INSUFFICIENT_BALANCE", required_kobo: charge }, { status: 402 });
        }

        // Place upstream order first; only debit if it succeeds.
        let providerOrderId: string;
        try {
          const panel = smmPanel(provider.api_url, provider.api_key);
          const r = await panel.addOrder(svc.provider_service_id, parsed.data.link, qty);
          providerOrderId = String(r.order);
        } catch (e: any) {
          return Response.json({ error: e?.message ?? "PANEL_ERROR" }, { status: 502 });
        }

        const { data: created, error: rpcErr } = await admin.rpc("create_smm_order", {
          _user_id: user.id,
          _service_id: parsed.data.service_id,
          _link: parsed.data.link,
          _quantity: qty,
          _charge_kobo: charge,
          _provider_order_id: providerOrderId,
          _provider_charge_usd: providerUsd,
        });
        if (rpcErr) {
          console.error("create_smm_order failed", rpcErr, { providerOrderId });
          return Response.json({ error: rpcErr.message }, { status: 500 });
        }

        const row = Array.isArray(created) ? created[0] : created;
        return Response.json({
          ok: true,
          order_id: row?.order_id,
          balance_kobo: row?.balance_kobo,
          provider_order_id: providerOrderId,
          charge_kobo: charge,
        });
      },
    },
  },
});
