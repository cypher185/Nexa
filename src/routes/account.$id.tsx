import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNaira } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/account/$id")({
  component: AccountDetail,
});

function AccountDetail() {
  const { id } = useParams({ from: "/account/$id" });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [buying, setBuying] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data: p } = await supabase
        .from("products")
        .select("*, categories(name, slug, accent)")
        .eq("id", id)
        .maybeSingle();
      if (!p) return null;
      const { data: counts } = await supabase.rpc("get_available_stock", { _product_ids: [id] });
      const stock = counts?.[0]?.available_count ?? 0;
      return { ...p, stock: Number(stock) };
    },
  });

  const handleBuy = async () => {
    if (!user) {
      toast.error("Please sign in first");
      void navigate({ to: "/auth", search: { mode: "signin", redirect: `/account/${id}` } });
      return;
    }
    setBuying(true);
    const { data: result, error } = await supabase.rpc("purchase_account", { _product_id: id });
    setBuying(false);
    if (error) {
      const msg = error.message || "";
      if (msg.includes("INSUFFICIENT_BALANCE")) {
        toast.error("Insufficient wallet balance", {
          description: "Fund your wallet to complete this purchase.",
          action: { label: "Fund wallet", onClick: () => navigate({ to: "/fund" }) },
        });
      } else if (msg.includes("OUT_OF_STOCK")) {
        toast.error("Out of stock", { description: "This product just sold out. Refresh for updates." });
        void refetch();
      } else {
        toast.error("Purchase failed", { description: msg });
      }
      return;
    }
    toast.success("Purchase successful!", { description: "Credentials are now in your dashboard." });
    void navigate({ to: "/purchases" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vault-bg">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="h-96 animate-pulse rounded-2xl bg-vault-surface" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-vault-bg">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-6 py-24 text-center text-zinc-400">
          Listing not found.{" "}
          <Link to="/browse" className="text-vault-gold-light">
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  const metadata = (data.metadata as Record<string, string>) || {};

  return (
    <div className="min-h-screen bg-vault-bg text-zinc-300">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/category/$slug"
          params={{ slug: data.categories?.slug ?? "" }}
          className="mb-6 inline-block text-xs text-zinc-500 hover:text-vault-gold-light"
        >
          ← Back to {data.categories?.name}
        </Link>

        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="rounded-3xl bg-vault-surface p-8 ring-1 ring-white/5">
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">
              {data.categories?.name}
            </span>
            <h1 className="mt-2 font-sora text-3xl font-semibold text-white">{data.title}</h1>
            {data.description && (
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{data.description}</p>
            )}

            {Object.keys(metadata).length > 0 && (
              <div className="mt-8 space-y-3 border-t border-white/5 pt-6">
                <h3 className="font-sora text-sm font-medium text-zinc-300">Account details</h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  {Object.entries(metadata).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-white/5 pb-2">
                      <dt className="text-zinc-500 capitalize">{k.replace(/_/g, " ")}</dt>
                      <dd className="text-zinc-200">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl bg-vault-surface p-6 ring-1 ring-white/5 md:sticky md:top-24">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Price</span>
              <div className="mt-1 font-sora text-3xl font-semibold text-white">
                {formatNaira(data.price_kobo)}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span
                className={`inline-block size-2 rounded-full ${data.stock > 0 ? "bg-emerald-400" : "bg-zinc-600"}`}
              />
              <span className="text-zinc-400">
                {data.stock > 0 ? `${data.stock} available` : "Out of stock"}
              </span>
            </div>
            <button
              disabled={buying || data.stock === 0}
              onClick={handleBuy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-vault-gold px-4 py-3 text-sm font-semibold text-vault-bg transition hover:bg-vault-gold-light disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              {buying && <Loader2 className="size-4 animate-spin" />}
              {data.stock === 0 ? "Out of stock" : buying ? "Processing…" : "Purchase with wallet"}
            </button>
            <p className="mt-3 text-center text-[11px] text-zinc-500">
              Credentials revealed instantly in your dashboard.
            </p>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
