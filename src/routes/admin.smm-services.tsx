import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { formatNaira } from "@/lib/format";
import { Search, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/admin/smm-services")({
  component: SmmServicesAdmin,
});

const DEFAULT_NGN_PER_USD = 1600;

function SmmServicesAdmin() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingCats, setEditingCats] = useState(false);

  const { data: providers } = useQuery({
    queryKey: ["admin", "smm-providers-min"],
    queryFn: async () => (await supabase.from("smm_providers").select("id, name")).data ?? [],
  });

  const { data: categories } = useQuery({
    queryKey: ["admin", "smm-categories"],
    queryFn: async () => (await supabase.from("smm_categories").select("*").order("sort_order").order("name")).data ?? [],
  });

  const { data: rateData } = useQuery({
    queryKey: ["admin", "smm-rate"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "smm_ngn_per_usd").maybeSingle();
      return Number((data?.value as any)?.value) || DEFAULT_NGN_PER_USD;
    },
  });
  const ngnPerUsd = rateData ?? DEFAULT_NGN_PER_USD;
  const [rateInput, setRateInput] = useState("");

  const { data: defaultMarkup } = useQuery({
    queryKey: ["admin", "smm-default-markup"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "smm_default_markup_pct").maybeSingle();
      const n = Number((data?.value as any)?.value);
      return Number.isFinite(n) ? n : 30;
    },
  });
  const [markupInput, setMarkupInput] = useState("");

  const { data: services } = useQuery({
    queryKey: ["admin", "smm-services"],
    queryFn: async () => (
      await supabase.from("smm_services").select("*, smm_providers(name), smm_categories(name, logo_url)").order("name").limit(2000)
    ).data ?? [],
  });

  const filtered = useMemo(() => {
    return (services ?? []).filter((s: any) => {
      if (providerFilter && s.provider_id !== providerFilter) return false;
      if (categoryFilter && s.category_id !== categoryFilter) return false;
      if (q) {
        const hay = `${s.name} ${s.provider_category ?? ""} ${s.type ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [services, q, providerFilter, categoryFilter]);

  const saveRate = async () => {
    const n = Number(rateInput);
    if (!Number.isFinite(n) || n <= 0) return toast.error("Enter a positive number");
    const { error } = await supabase.from("site_settings").upsert({
      key: "smm_ngn_per_usd",
      value: { value: n },
      updated_at: new Date().toISOString(),
    });
    if (error) return toast.error(error.message);
    toast.success(`FX saved: ₦${n} / $1`);
    qc.invalidateQueries({ queryKey: ["admin", "smm-rate"] });
  };

  const saveDefaultMarkup = async () => {
    const n = Number(markupInput);
    if (!Number.isFinite(n) || n < 0) return toast.error("Enter a non-negative number");
    const { error } = await supabase.from("site_settings").upsert({
      key: "smm_default_markup_pct",
      value: { value: n },
      updated_at: new Date().toISOString(),
    });
    if (error) return toast.error(error.message);
    toast.success(`Default markup saved: ${n}% (applies to newly-synced services)`);
    qc.invalidateQueries({ queryKey: ["admin", "smm-default-markup"] });
  };

  const applyMarkupToAll = async () => {
    const n = Number(markupInput || defaultMarkup);
    if (!Number.isFinite(n) || n < 0) return toast.error("Enter a number");
    if (!confirm(`Set markup to ${n}% on ALL services? This overrides per-service overrides.`)) return;
    const { data, error } = await supabase.rpc("admin_apply_smm_markup", { _pct: n });
    if (error) return toast.error(error.message);
    toast.success(`Applied ${n}% to ${data ?? 0} services`);
    qc.invalidateQueries({ queryKey: ["admin", "smm-services"] });
  };

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("smm_services").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "smm-services"] });
  };

  const addCategory = async () => {
    const name = prompt("Category name (e.g. Instagram)");
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { error } = await supabase.from("smm_categories").insert({ name, slug });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "smm-categories"] });
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-zinc-500">SMM</p>
        <h1 className="mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white">SMM Services</h1>
        <p className="mt-1 max-w-2xl text-xs text-zinc-500">
          User price = USD rate × NGN/USD × (1 + markup%). Default markup applies to all newly-synced services; per-service overrides are preserved.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">FX rate (₦ per $1)</p>
          <p className="mt-1 font-sora text-xl text-white">₦{ngnPerUsd.toLocaleString()}</p>
          <div className="mt-3 flex gap-2">
            <input type="number" min={1} step={1} placeholder={String(ngnPerUsd)} value={rateInput} onChange={(e) => setRateInput(e.target.value)}
              className="w-32 rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" />
            <button onClick={saveRate} className="rounded-lg bg-vault-gold px-3 py-2 text-xs font-semibold text-vault-bg hover:bg-vault-gold-light">Save</button>
          </div>
        </div>

        <div className="rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Default markup %</p>
          <p className="mt-1 font-sora text-xl text-white">{defaultMarkup ?? 30}%</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input type="number" min={0} step={1} placeholder={String(defaultMarkup ?? 30)} value={markupInput} onChange={(e) => setMarkupInput(e.target.value)}
              className="w-24 rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" />
            <button onClick={saveDefaultMarkup} className="rounded-lg bg-vault-gold px-3 py-2 text-xs font-semibold text-vault-bg hover:bg-vault-gold-light">Save default</button>
            <button onClick={applyMarkupToAll} className="rounded-lg border border-vault-gold/30 px-3 py-2 text-xs text-vault-gold-light hover:bg-vault-gold/10">Apply to all</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Categories &amp; logos</p>
            <p className="text-xs text-zinc-400">Set an official logo URL for each category — shown on the storefront.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditingCats((v) => !v)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5">
              {editingCats ? "Done" : "Edit logos"}
            </button>
            <button onClick={addCategory} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5">+ Add</button>
          </div>
        </div>
        {editingCats && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {(categories ?? []).map((c: any) => (
              <CategoryRow key={c.id} cat={c} onSaved={() => qc.invalidateQueries({ queryKey: ["admin", "smm-categories"] })} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-3.5 text-zinc-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services" className="w-60 rounded-lg border border-white/10 bg-vault-surface pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" />
        </div>
        <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} className="rounded-lg border border-white/10 bg-vault-surface px-3 py-2 text-sm text-white outline-none">
          <option value="">All providers</option>
          {providers?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-white/10 bg-vault-surface px-3 py-2 text-sm text-white outline-none">
          <option value="">All categories</option>
          {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="text-xs text-zinc-500">{filtered.length} service{filtered.length === 1 ? "" : "s"}</span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-3">Service</th>
              <th className="p-3">Provider</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Rate (USD/1k)</th>
              <th className="p-3 text-right">Markup %</th>
              <th className="p-3 text-right">User ₦/1k</th>
              <th className="p-3 text-right">Min</th>
              <th className="p-3 text-right">Max</th>
              <th className="p-3 text-center">Visible</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="p-8 text-center text-zinc-500">No services. Sync a provider first.</td></tr>
            ) : filtered.map((s: any) => {
              const ngnPer1k = Math.ceil(Number(s.rate_usd_per_1000) * ngnPerUsd * (1 + Number(s.markup_pct) / 100));
              return (
                <tr key={s.id} className="border-b border-white/5 last:border-0">
                  <td className="p-3 text-zinc-100">
                    <div className="flex items-center gap-2">
                      {s.smm_categories?.logo_url && (
                        <img src={s.smm_categories.logo_url} alt="" className="size-5 rounded object-contain" />
                      )}
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-[10px] text-zinc-500">{s.provider_category} {s.type ? `· ${s.type}` : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-zinc-400">{s.smm_providers?.name}</td>
                  <td className="p-3">
                    <select value={s.category_id ?? ""} onChange={(e) => update(s.id, { category_id: e.target.value || null })} className="rounded border border-white/10 bg-vault-bg px-2 py-1 text-xs text-white">
                      <option value="">—</option>
                      {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-right tabular-nums text-zinc-400">${Number(s.rate_usd_per_1000).toFixed(4)}</td>
                  <td className="p-3 text-right">
                    <input
                      type="number" min={0} step={1} defaultValue={s.markup_pct}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v) && v !== Number(s.markup_pct)) update(s.id, { markup_pct: v });
                      }}
                      className="w-16 rounded border border-white/10 bg-vault-bg px-2 py-1 text-right text-xs text-white"
                    />
                  </td>
                  <td className="p-3 text-right tabular-nums text-vault-gold-light">{formatNaira(ngnPer1k * 100)}</td>
                  <td className="p-3 text-right text-xs text-zinc-400">{s.min_qty}</td>
                  <td className="p-3 text-right text-xs text-zinc-400">{s.max_qty.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => update(s.id, { visible: !s.visible, enabled: !s.visible })} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.visible && s.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`}>
                      {s.visible && s.enabled ? "Visible" : "Hidden"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryRow({ cat, onSaved }: { cat: any; onSaved: () => void }) {
  const [logo, setLogo] = useState(cat.logo_url ?? "");
  const save = async () => {
    const { error } = await supabase.from("smm_categories").update({ logo_url: logo || null }).eq("id", cat.id);
    if (error) return toast.error(error.message);
    toast.success(`Saved logo for ${cat.name}`);
    onSaved();
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-vault-bg/40 p-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-vault-bg ring-1 ring-white/10">
        {logo ? <img src={logo} alt="" className="size-8 object-contain" /> : <ImageIcon className="size-4 text-zinc-600" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white">{cat.name}</p>
        <input
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="https://… logo URL"
          className="mt-1 w-full rounded border border-white/10 bg-vault-bg px-2 py-1 text-xs text-zinc-200 outline-none"
        />
      </div>
      <button onClick={save} className="rounded bg-vault-gold px-2 py-1 text-[11px] font-semibold text-vault-bg">Save</button>
    </div>
  );
}
