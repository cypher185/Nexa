import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { useMemo, useState } from "react";
import { formatNaira } from "@/lib/format";
import { Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/smm")({
  head: () => ({
    meta: [
      { title: "SMM Services — NexaLogs" },
      { name: "description", content: "Boost any social profile — followers, likes, views and more. Auto-delivered, wallet-paid." },
      { property: "og:title", content: "SMM Services — NexaLogs" },
      { property: "og:description", content: "Auto-delivered SMM services for Instagram, TikTok, YouTube, X and more." },
    ],
  }),
  component: SmmCatalog,
});

const DEFAULT_NGN_PER_USD = 1600;

function SmmCatalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");

  const { data: rate } = useQuery({
    queryKey: ["smm-rate"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "smm_ngn_per_usd").maybeSingle();
      return Number((data?.value as any)?.value) || DEFAULT_NGN_PER_USD;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["smm-categories-public"],
    queryFn: async () => (await supabase.from("smm_categories").select("*").order("sort_order")).data ?? [],
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ["smm-services-public"],
    queryFn: async () => (
      await supabase.from("smm_services").select("id, name, type, rate_usd_per_1000, markup_pct, min_qty, max_qty, category_id, provider_category, smm_categories(name, logo_url)").order("name").limit(2000)
    ).data ?? [],
  });

  const ngnPerUsd = rate ?? DEFAULT_NGN_PER_USD;

  const filtered = useMemo(() => {
    return (services ?? []).filter((s: any) => {
      if (cat && s.category_id !== cat) return false;
      if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [services, q, cat]);

  return (
    <div className="min-h-screen bg-vault-bg">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-vault-gold">SMM Services</p>
          <h1 className="mt-2 font-sora text-3xl sm:text-4xl font-semibold text-white">Grow any social profile, instantly.</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Followers, likes, views, comments and more — paid from your NexaLogs wallet. Orders auto-place against our panel network and progress is tracked in real time.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search e.g. Instagram followers"
              className="w-72 rounded-lg border border-white/10 bg-vault-surface pl-10 pr-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
            />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg border border-white/10 bg-vault-surface px-3 py-2 text-sm text-white outline-none">
            <option value="">All categories</option>
            {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span className="text-xs text-zinc-500">{filtered.length} service{filtered.length === 1 ? "" : "s"}</span>
        </div>

        {isLoading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-vault-surface p-10 text-center ring-1 ring-white/5">
            <p className="text-sm text-zinc-400">No services available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s: any) => {
              const ngnPer1k = Math.ceil(Number(s.rate_usd_per_1000) * ngnPerUsd * (1 + Number(s.markup_pct) / 100));
              return (
                <Link
                  key={s.id}
                  to="/smm/$serviceId"
                  params={{ serviceId: s.id }}
                  resetScroll={false}
                  className="group rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5 transition hover:bg-vault-surface/70 hover:ring-vault-gold/30"
                >
                  <div className="flex items-center gap-2">
                    {(s as any).smm_categories?.logo_url && (
                      <img src={(s as any).smm_categories.logo_url} alt="" className="size-6 rounded object-contain" />
                    )}
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">{(s as any).smm_categories?.name ?? s.provider_category ?? s.type ?? "Service"}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-white">{s.name}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500">per 1,000</p>
                      <p className="font-sora text-lg text-vault-gold-light">{formatNaira(ngnPer1k * 100)}</p>
                    </div>
                    <ArrowRight className="size-4 text-zinc-500 transition group-hover:text-vault-gold-light" />
                  </div>
                  <p className="mt-2 text-[10px] text-zinc-500">Min {s.min_qty.toLocaleString()} · Max {s.max_qty.toLocaleString()}</p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
