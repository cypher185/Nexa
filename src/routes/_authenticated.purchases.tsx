import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNaira } from "@/lib/format";
import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/purchases")({
  component: PurchasesPage,
});

function PurchasesPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["purchases", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, price_kobo, status, created_at, stock_id, products(title, categories(name))")
        .eq("user_id", user!.id)
        .eq("status", "fulfilled")
        .order("created_at", { ascending: false });
      if (!data) return [];
      const stockIds = data.map((o) => o.stock_id).filter(Boolean) as string[];
      let stocks: Record<string, { credentials: string }> = {};
      if (stockIds.length > 0) {
        const { data: s } = await supabase
          .from("account_stock")
          .select("id, credentials")
          .in("id", stockIds);
        stocks = Object.fromEntries((s ?? []).map((x) => [x.id, { credentials: x.credentials }]));
      }
      return data.map((o) => ({ ...o, credentials: stocks[o.stock_id ?? ""]?.credentials ?? null }));
    },
  });

  return (
    <div className="min-h-screen bg-vault-bg text-zinc-300">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">My accounts</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Purchased accounts</h1>
        </header>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-vault-surface" />
            ))}
          </div>
        ) : (data?.length ?? 0) === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-500">
            You haven't purchased any accounts yet.
          </div>
        ) : (
          <div className="space-y-4">
            {data?.map((o: any) => <PurchaseCard key={o.id} order={o} />)}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function PurchaseCard({ order }: { order: any }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!order.credentials) return;
    navigator.clipboard.writeText(order.credentials);
    setCopied(true);
    toast.success("Credentials copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">
            {order.products?.categories?.name}
          </p>
          <h3 className="mt-1 font-sora text-base font-medium text-white">{order.products?.title}</h3>
          <p className="mt-1 text-[11px] text-zinc-500">
            Purchased {new Date(order.created_at).toLocaleString()} · {formatNaira(order.price_kobo)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShown((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/10"
          >
            {shown ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {shown ? "Hide" : "Reveal"}
          </button>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-vault-gold px-3 py-1.5 text-xs font-semibold text-vault-bg hover:bg-vault-gold-light"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            Copy
          </button>
        </div>
      </div>
      {shown && order.credentials && (
        <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-vault-bg p-4 font-mono text-xs leading-relaxed text-vault-gold-light ring-1 ring-vault-gold/10">
{order.credentials}
        </pre>
      )}
    </div>
  );
}
