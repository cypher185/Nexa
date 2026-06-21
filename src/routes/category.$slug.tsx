import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = useParams({ from: "/category/$slug" });
  const { data, isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data: cat } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!cat) return { cat: null, prods: [] };
      const { data: prods } = await supabase
        .from("products")
        .select("id, title, description, price_kobo, metadata")
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      return { cat, prods: prods ?? [] };
    },
  });

  return (
    <div className="min-h-screen bg-vault-bg text-zinc-300">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <Link to="/browse" className="mb-6 inline-block text-xs text-zinc-500 hover:text-vault-gold-light">
          ← All categories
        </Link>
        {isLoading ? (
          <div className="h-24 animate-pulse rounded-2xl bg-vault-surface" />
        ) : !data?.cat ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-400">
            Category not found.
          </div>
        ) : (
          <>
            <header className="mb-10">
              <h1 className="font-sora text-4xl font-semibold text-white">{data.cat.name}</h1>
              {data.cat.description && (
                <p className="mt-2 max-w-2xl text-sm text-zinc-500">{data.cat.description}</p>
              )}
            </header>

            {data.prods.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-400">
                No listings in this category yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.prods.map((p) => (
                  <Link
                    key={p.id}
                    to="/account/$id"
                    params={{ id: p.id }}
                    className="group flex flex-col rounded-2xl bg-vault-surface p-6 ring-1 ring-black/5 transition hover:ring-vault-gold/20"
                  >
                    <h3 className="font-sora text-base font-medium text-white line-clamp-2">{p.title}</h3>
                    {p.description && (
                      <p className="mt-2 line-clamp-3 text-xs text-zinc-500">{p.description}</p>
                    )}
                    <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-4 mt-6">
                      <span className="font-sora text-lg font-semibold text-vault-gold-light">
                        {formatNaira(p.price_kobo)}
                      </span>
                      <span className="text-xs text-vault-gold group-hover:underline">View →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
