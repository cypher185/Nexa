import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";
import { authAdmin } from "@/lib/smm/auth.server";
import { smmPanel } from "@/lib/smm/panel-client.server";

const schema = z.object({ provider_id: z.string().uuid() });

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "uncategorized";
}

export const Route = createFileRoute("/api/smm/admin/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { error } = await authAdmin(request);
        if (error) return error;

        const body = await request.json().catch(() => ({}));
        const parsed = schema.safeParse(body);
        if (!parsed.success) return Response.json({ error: "INVALID_BODY" }, { status: 400 });

        const admin = getSupabaseAdmin();
        const { data: provider } = await admin
          .from("smm_providers").select("*").eq("id", parsed.data.provider_id).maybeSingle();
        if (!provider) return Response.json({ error: "PROVIDER_NOT_FOUND" }, { status: 404 });

        let services: any[];
        let balance: any = null;
        try {
          const panel = smmPanel(provider.api_url, provider.api_key);
          services = await panel.services();
          try { balance = await panel.balance(); } catch { /* ignore */ }
        } catch (e: any) {
          return Response.json({ error: e?.message ?? "PANEL_ERROR" }, { status: 502 });
        }

        const { data: mk } = await admin.from("site_settings").select("value").eq("key", "smm_default_markup_pct").maybeSingle();
        const defaultMarkup = Number((mk?.value as any)?.value);
        const useDefault = Number.isFinite(defaultMarkup) && defaultMarkup >= 0;

        // 1) Auto-create categories from unique provider_category values
        const uniqueCats = Array.from(new Set(services.map((s) => (s.category ?? "").toString().trim()).filter(Boolean)));
        const nameToId = new Map<string, string>();
        for (const name of uniqueCats) {
          const slug = slugify(name);
          const { data: existing } = await admin.from("smm_categories").select("id").eq("slug", slug).maybeSingle();
          if (existing) { nameToId.set(name, existing.id); continue; }
          const { data: ins } = await admin.from("smm_categories").insert({ name, slug }).select("id").maybeSingle();
          if (ins) nameToId.set(name, ins.id);
        }

        // 2) Upsert services; preserve admin overrides
        let upserted = 0;
        let categoriesAssigned = 0;
        for (const s of services) {
          const provCat = (s.category ?? "").toString().trim();
          const catId = provCat ? nameToId.get(provCat) ?? null : null;

          const { data: existing } = await admin
            .from("smm_services").select("category_id, markup_pct")
            .eq("provider_id", provider.id).eq("provider_service_id", String(s.service)).maybeSingle();

          const row: any = {
            provider_id: provider.id,
            provider_service_id: String(s.service),
            name: String(s.name ?? "Service"),
            type: s.type ?? null,
            provider_category: provCat || null,
            rate_usd_per_1000: Number(s.rate ?? 0),
            min_qty: parseInt(String(s.min ?? 1), 10) || 1,
            max_qty: parseInt(String(s.max ?? 1000000), 10) || 1000000,
            dripfeed: Boolean(s.dripfeed),
            refill: Boolean(s.refill),
            cancel: Boolean(s.cancel),
            description: s.description ?? null,
            updated_at: new Date().toISOString(),
          };
          if (!existing?.category_id && catId) { row.category_id = catId; categoriesAssigned++; }
          if (!existing && useDefault) row.markup_pct = defaultMarkup;

          const { error: upErr } = await admin
            .from("smm_services")
            .upsert(row, { onConflict: "provider_id,provider_service_id", ignoreDuplicates: false });
          if (!upErr) upserted++;
        }

        await admin
          .from("smm_providers")
          .update({
            balance_usd: balance ? Number(balance.balance) : null,
            currency: balance?.currency ?? provider.currency ?? "USD",
            last_synced_at: new Date().toISOString(),
          })
          .eq("id", provider.id);

        return Response.json({
          ok: true,
          services_synced: upserted,
          categories_created: nameToId.size,
          categories_assigned: categoriesAssigned,
          balance,
        });
      },
    },
  },
});
