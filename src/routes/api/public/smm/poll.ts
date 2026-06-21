import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";
import { smmPanel, normalizeStatus } from "@/lib/smm/panel-client.server";
import { getNgnPerUsd } from "@/lib/smm/auth.server";

/**
 * Poll pending/in-progress SMM orders against their upstream panel and update
 * status. Refunds wallet for canceled (full) and partial orders.
 *
 * Auth: header `x-cron-secret: <SMM_CRON_SECRET>` OR admin Bearer token.
 */
export const Route = createFileRoute("/api/public/smm/poll")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const admin = getSupabaseAdmin();

        // Auth
        const cronSecret = process.env.SMM_CRON_SECRET;
        const provided = request.headers.get("x-cron-secret");
        let authorized = Boolean(cronSecret && provided && provided === cronSecret);
        let source: "cron" | "manual" = provided ? "cron" : "manual";
        if (!authorized) {
          const auth = request.headers.get("authorization");
          if (auth?.startsWith("Bearer ")) {
            const { data } = await admin.auth.getUser(auth.slice(7));
            if (data.user) {
              const { data: isAdmin } = await admin.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
              if (isAdmin) {
                authorized = true;
                source = "manual";
              }
            }
          }
        }
        if (!authorized) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });

        // Start poll log entry
        const { data: pollRow } = await admin
          .from("smm_poll_log")
          .insert({ source, started_at: new Date().toISOString() })
          .select("id")
          .single();
        const pollId = pollRow?.id as string | undefined;

        const finish = async (payload: { checked: number; updated: number; errors: string[]; ok: boolean; extra?: Record<string, unknown> }) => {
          if (pollId) {
            await admin
              .from("smm_poll_log")
              .update({
                finished_at: new Date().toISOString(),
                checked: payload.checked,
                updated: payload.updated,
                errors: payload.errors.length ? payload.errors : null,
                ok: payload.ok,
              })
              .eq("id", pollId);
          }
          return Response.json({ ok: payload.ok, checked: payload.checked, updated: payload.updated, errors: payload.errors, ...payload.extra });
        };

        // Pull active orders grouped by provider
        const { data: orders } = await admin
          .from("smm_orders")
          .select("id, provider_id, provider_order_id, status, charge_kobo, refund_kobo, quantity")
          .in("status", ["pending", "in_progress"])
          .not("provider_order_id", "is", null)
          .limit(500);

        if (!orders || orders.length === 0) {
          return finish({ checked: 0, updated: 0, errors: [], ok: true });
        }

        const byProvider = new Map<string, typeof orders>();
        for (const o of orders) {
          const arr = byProvider.get(o.provider_id) ?? [];
          arr.push(o);
          byProvider.set(o.provider_id, arr);
        }

        const ngnPerUsd = await getNgnPerUsd();
        let updated = 0;
        const errors: string[] = [];

        for (const [providerId, list] of byProvider) {
          const { data: provider } = await admin
            .from("smm_providers")
            .select("api_url, api_key")
            .eq("id", providerId)
            .maybeSingle();
          if (!provider) continue;

          for (let i = 0; i < list.length; i += 100) {
            const chunk = list.slice(i, i + 100);
            try {
              const panel = smmPanel(provider.api_url, provider.api_key);
              const result = await panel.status(chunk.map((o) => o.provider_order_id!));
              for (const o of chunk) {
                const r = (result as any)[o.provider_order_id!] ?? (result as any)[String(o.provider_order_id)];
                if (!r) continue;
                const newStatus = normalizeStatus(r.status);
                const remains = r.remains != null ? parseInt(String(r.remains), 10) : null;
                const startCount = r.start_count != null ? parseInt(String(r.start_count), 10) : null;
                const oldStatus = o.status;
                const updates: any = {
                  status: newStatus,
                  remains,
                  start_count: startCount,
                  last_polled_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                await admin.from("smm_orders").update(updates).eq("id", o.id);

                // Log per-order event only on status change
                if (newStatus !== oldStatus) {
                  await admin.from("smm_order_events").insert({
                    order_id: o.id,
                    poll_id: pollId,
                    old_status: oldStatus,
                    new_status: newStatus,
                    remains,
                    start_count: startCount,
                  });
                }

                // Refund logic
                if (newStatus === "canceled" && o.refund_kobo === 0) {
                  await admin.rpc("refund_smm_order", {
                    _order_id: o.id,
                    _amount_kobo: o.charge_kobo,
                    _reason: "SMM order canceled — full refund",
                  });
                } else if (newStatus === "partial" && o.refund_kobo === 0 && remains != null && remains > 0) {
                  const refund = Math.floor((o.charge_kobo * remains) / o.quantity);
                  if (refund > 0) {
                    await admin.rpc("refund_smm_order", {
                      _order_id: o.id,
                      _amount_kobo: refund,
                      _reason: `SMM partial refund (${remains} of ${o.quantity} remaining)`,
                    });
                  }
                }
                updated++;
              }
            } catch (e: any) {
              const msg = `provider ${providerId}: ${e?.message ?? e}`;
              errors.push(msg);
              if (pollId) {
                await admin.from("smm_order_events").insert({
                  order_id: chunk[0]?.id ?? null,
                  poll_id: pollId,
                  note: msg,
                } as any);
              }
            }
          }
        }

        return finish({ checked: orders.length, updated, errors, ok: errors.length === 0, extra: { ngn_per_usd: ngnPerUsd } });
      },
    },
  },
});
