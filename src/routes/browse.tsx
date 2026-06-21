import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/browse")({
  component: Browse,
});

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

function Browse() {
  const { data, isLoading } = useQuery({
    queryKey: ["browse"],
    queryFn: async () => {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, slug, name, description, icon, accent")
        .eq("is_active", true)
        .order("sort_order");

      const { data: prods } = await supabase
        .from("products")
        .select("id, title, price_kobo, category_id, metadata, categories(name, slug, accent)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      return { cats: cats ?? [], prods: prods ?? [] };
    },
  });

  const cats = data?.cats ?? [];
  const prods = data?.prods ?? [];

  return (
    <div className="min-h-screen bg-vault-bg text-zinc-300">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-12">
          <h1 className="font-sora text-4xl font-semibold text-white">Marketplace</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Every aged account in the NexaLogs vault, organised by platform.
          </p>
        </header>

        {/* Category chips */}
        <div className="mb-12 flex flex-wrap gap-2">
          {cats.map((c) => (
            <Link
              key={c.id}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="rounded-full border border-white/10 bg-vault-surface px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-vault-gold/30 hover:text-vault-gold-light"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-vault-surface" />
            ))}
          </div>
        ) : prods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <p className="text-zinc-400">No products listed yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prods.map((p: any) => (
              <Link
                key={p.id}
                to="/account/$id"
                params={{ id: p.id }}
                className="group rounded-2xl bg-vault-surface p-5 ring-1 ring-black/5 transition hover:ring-vault-gold/20"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid size-10 place-items-center rounded-lg ring-1 ${
                        accentColors[p.categories?.accent ?? "white"] ?? accentColors.white
                      }`}
                    >
                      <span className="font-sora text-xs font-semibold">
                        {p.categories?.name?.[0] ?? "·"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-100 line-clamp-1">{p.title}</p>
                      <p className="text-[11px] uppercase tracking-tighter text-zinc-500">
                        {p.categories?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between border-t border-white/5 pt-4">
                  <span className="font-sora text-lg font-semibold text-white">
                    {formatNaira(p.price_kobo)}
                  </span>
                  <span className="text-xs text-vault-gold-light group-hover:underline">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
