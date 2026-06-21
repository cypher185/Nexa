import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNaira } from "@/lib/format";
import { ArrowRight, ShieldCheck, Zap, Headphones } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Landing,
});

type CategoryWithStats = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  accent: string | null;
  sort_order: number;
  starting_price_kobo: number | null;
  stock_count: number;
};

const accentColors: Record<string, string> = {
  blue: "bg-blue-600/10 text-blue-400 ring-blue-500/20",
  pink: "bg-pink-600/10 text-pink-400 ring-pink-500/20",
  cyan: "bg-cyan-600/10 text-cyan-400 ring-cyan-500/20",
  white: "bg-white/5 text-white ring-white/10",
  amber: "bg-amber-600/10 text-amber-400 ring-amber-500/20",
  red: "bg-red-600/10 text-red-400 ring-red-500/20",
  sky: "bg-sky-600/10 text-sky-400 ring-sky-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
};

function accentClass(a: string | null) {
  return accentColors[a ?? "white"] ?? accentColors.white;
}

async function fetchHomeData() {
  const { data: cats } = await supabase
    .from("categories")
    .select("id, slug, name, description, icon, accent, sort_order")
    .eq("is_active", true)
    .order("sort_order");

  const categories = cats ?? [];
  // Gather products per category, then fetch available counts via RPC in one call.
  const categoryProducts = await Promise.all(
    categories.map(async (c) => {
      const { data: prods } = await supabase
        .from("products")
        .select("id, price_kobo")
        .eq("category_id", c.id)
        .eq("is_active", true);
      return { c, prods: prods ?? [] };
    }),
  );

  const allProductIds = categoryProducts.flatMap(({ prods }) => prods.map((p) => p.id));
  const stockMap = new Map<string, number>();
  if (allProductIds.length > 0) {
    const { data: counts } = await supabase.rpc("get_available_stock", { _product_ids: allProductIds });
    (counts ?? []).forEach((row: { product_id: string; available_count: number | string }) => {
      stockMap.set(row.product_id, Number(row.available_count));
    });
  }

  const stats: CategoryWithStats[] = categoryProducts.map(({ c, prods }) => {
    const stock = prods.reduce((sum, p) => sum + (stockMap.get(p.id) ?? 0), 0);
    const starting = prods.length > 0 ? Math.min(...prods.map((p) => p.price_kobo)) : null;
    return { ...c, starting_price_kobo: starting, stock_count: stock } satisfies CategoryWithStats;
  });

  // Featured = newest 3 products with available stock
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("id, title, description, price_kobo, metadata, category_id, categories(name, slug, accent)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return { categories: stats, featured: featuredProducts ?? [] };
}

function Landing() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHomeData,
  });

  const categories = data?.categories ?? [];
  const featured = data?.featured ?? [];

  return (
    <div className="min-h-screen bg-vault-bg font-manrope text-zinc-300">
      <SiteHeader />

      <main className="space-y-24 py-16">
        {/* Hero */}
        <section className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-vault-gold/10 blur-[120px]" />
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-zinc-900/50 px-3 py-1 text-xs font-medium tracking-wide text-zinc-400">
            <span className="text-vault-gold-light">New</span> Verified Nigerian Gmail accounts in stock
          </div>
          <h1 className="mx-auto mb-6 max-w-[20ch] font-sora text-5xl font-semibold leading-none tracking-tight text-balance text-zinc-100 md:text-6xl">
            Premium aged social accounts,{" "}
            <span className="gold-text">delivered instantly</span>
          </h1>
          <p className="mx-auto max-w-[56ch] text-lg text-pretty text-zinc-400">
            The most reliable secondary market for aged digital assets in Nigeria. Fund your
            wallet, browse the vault, and own a verified account in seconds.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/browse"
              className="rounded-xl bg-vault-gold px-7 py-3.5 text-sm font-semibold text-vault-bg transition-colors hover:bg-vault-gold-light"
            >
              Browse the vault
            </Link>
            {!user && (
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Create account
              </Link>
            )}
          </div>
        </section>

        {/* Bento category grid */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-sora text-2xl font-medium text-zinc-100">Browse categories</h2>
              <p className="mt-1 text-sm text-zinc-500">Pick a platform. Buy in seconds.</p>
            </div>
            <Link to="/browse" className="text-sm font-medium text-vault-gold hover:text-vault-gold-light">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <BentoSkeleton />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {categories.slice(0, 8).map((c, i) => {
                const big = i === 0;
                return (
                  <Link
                    key={c.id}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-vault-surface p-6 ring-1 ring-black/5 transition hover:bg-zinc-800/80 hover:ring-vault-gold/20 ${
                      big ? "col-span-2 row-span-2 p-8 md:min-h-[320px]" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-vault-gold/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative z-10">
                      <div
                        className={`mb-4 flex ${big ? "size-12" : "size-10"} items-center justify-center rounded-xl ring-1 ${accentClass(c.accent)}`}
                      >
                        <span className="font-sora text-sm font-semibold lowercase">{c.icon ?? c.name[0]}</span>
                      </div>
                      <h3 className={`font-sora ${big ? "text-2xl" : "text-lg"} font-medium text-white`}>
                        {c.name}
                      </h3>
                      {big && c.description && (
                        <p className="mt-2 max-w-[28ch] text-sm text-zinc-400">{c.description}</p>
                      )}
                    </div>
                    <div className="relative z-10 mt-6 flex items-end justify-between">
                      <div>
                        <span className="block text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                          {big ? "Starting at" : "From"}
                        </span>
                        <span className={`font-semibold text-vault-gold-light ${big ? "text-2xl" : "text-base"}`}>
                          {c.starting_price_kobo !== null ? formatNaira(c.starting_price_kobo) : "—"}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-zinc-500">
                        {c.stock_count > 0 ? `${c.stock_count.toLocaleString()} in stock` : "Restocking"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Newest arrivals */}
        {featured.length > 0 && (
          <section className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between">
              <div className="space-y-1">
                <h2 className="font-sora text-2xl font-medium text-zinc-100">Newest arrivals</h2>
                <p className="text-sm text-zinc-500">Fresh stock added to the vault.</p>
              </div>
              <Link to="/browse" className="text-sm font-medium text-vault-gold hover:text-vault-gold-light">
                View all listings
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featured.slice(0, 3).map((p: any) => (
                <Link
                  key={p.id}
                  to="/account/$id"
                  params={{ id: p.id }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-vault-surface ring-1 ring-black/5 transition hover:ring-vault-gold/20"
                >
                  <div className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid size-10 place-items-center rounded-lg ring-1 ${accentClass(p.categories?.accent)}`}
                        >
                          <span className="font-sora text-xs font-semibold">{p.categories?.name?.[0] ?? "·"}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-100 line-clamp-1">{p.title}</p>
                          <p className="text-[11px] uppercase tracking-tighter text-zinc-500">
                            {p.categories?.name}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                        Available
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-500 line-clamp-3">
                      {p.description || "Verified asset with clean history."}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 p-4">
                    <span className="font-sora text-lg font-medium text-white">
                      {formatNaira(p.price_kobo)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-vault-gold px-4 py-2 text-sm font-medium text-vault-bg transition-colors group-hover:bg-vault-gold-light">
                      View <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trust strip */}
        <section className="border-y border-white/5 bg-vault-surface/50 py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
            {[
              { icon: Zap, title: "Instant fulfilment", body: "Credentials revealed in your dashboard the moment payment confirms." },
              { icon: ShieldCheck, title: "Wallet-secured", body: "Korapay-funded wallet keeps every purchase atomic. No half-transactions." },
              { icon: Headphones, title: "Naija-first support", body: "Real humans on WhatsApp & email. Disputes handled fast." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-vault-gold/10 ring-1 ring-vault-gold/30">
                  <Icon className="size-5 text-vault-gold-light" />
                </div>
                <div>
                  <h4 className="font-sora text-sm font-medium text-white">{title}</h4>
                  <p className="mt-1 text-xs text-zinc-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-vault-bg p-10 text-center ring-1 ring-white/5 md:p-14">
            <h2 className="mb-4 font-sora text-3xl font-medium text-white md:text-4xl">
              Ready to scale your presence?
            </h2>
            <p className="mx-auto mb-10 max-w-[48ch] text-zinc-400">
              Top up your NexaLogs wallet via Korapay and start acquiring premium digital assets today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/fund"
                className="rounded-xl bg-vault-gold px-8 py-4 text-sm font-semibold text-vault-bg transition active:scale-[0.98] hover:bg-vault-gold-light gold-glow"
              >
                Fund wallet now
              </Link>
              <Link
                to="/browse"
                className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                Browse all categories
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function BentoSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`h-40 animate-pulse rounded-2xl bg-vault-surface ${i === 0 ? "col-span-2 row-span-2 h-auto md:min-h-[320px]" : ""}`}
        />
      ))}
    </div>
  );
}
