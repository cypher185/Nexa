import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNairaDecimal, formatNaira } from "@/lib/format";
import { Wallet, ShoppingBag, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["dashboard", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [wallet, recentOrders, recentTx] = await Promise.all([
        supabase.from("wallets").select("balance_kobo").eq("user_id", user!.id).maybeSingle(),
        supabase
          .from("orders")
          .select("id, price_kobo, status, created_at, products(title)")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("wallet_transactions")
          .select("id, type, amount_kobo, status, created_at, description")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      return {
        balance: wallet.data?.balance_kobo ?? 0,
        orders: recentOrders.data ?? [],
        txs: recentTx.data ?? [],
      };
    },
  });

  return (
    <div className="min-h-screen bg-vault-bg text-zinc-300">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Welcome back</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">
            {user?.user_metadata?.full_name || user?.email}
          </h1>
        </header>

        {/* Wallet card */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-vault-surface to-vault-bg p-8 ring-1 ring-vault-gold/20">
            <div className="absolute -top-12 -right-12 size-60 rounded-full bg-vault-gold/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-vault-gold-light">
                <Wallet className="size-4" />
                Wallet balance
              </div>
              <div className="mt-3 font-sora text-5xl font-semibold text-white tabular-nums">
                {formatNairaDecimal(data?.balance)}
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/fund"
                  className="inline-flex items-center gap-2 rounded-xl bg-vault-gold px-5 py-2.5 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light"
                >
                  <Plus className="size-4" /> Fund wallet
                </Link>
                <Link
                  to="/wallet"
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Wallet history
                </Link>
              </div>
            </div>
          </div>
          <Link
            to="/purchases"
            className="group flex flex-col justify-between rounded-3xl bg-vault-surface p-8 ring-1 ring-white/5 hover:ring-vault-gold/20"
          >
            <ShoppingBag className="size-6 text-vault-gold-light" />
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500">My accounts</p>
              <p className="mt-1 font-sora text-2xl font-semibold text-white">
                {data?.orders?.filter((o) => o.status === "fulfilled").length ?? 0} owned
              </p>
              <p className="mt-1 text-xs text-vault-gold group-hover:underline">View all →</p>
            </div>
          </Link>
        </div>

        {/* Recent orders */}
        <section className="mt-12">
          <h2 className="mb-4 font-sora text-lg font-medium text-white">Recent purchases</h2>
          <div className="overflow-hidden rounded-2xl bg-vault-surface ring-1 ring-white/5">
            {(data?.orders.length ?? 0) === 0 ? (
              <p className="p-8 text-center text-sm text-zinc-500">
                No purchases yet.{" "}
                <Link to="/browse" className="text-vault-gold-light">
                  Browse the vault →
                </Link>
              </p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {data?.orders.map((o: any) => (
                    <tr key={o.id} className="border-b border-white/5 last:border-0">
                      <td className="p-4">
                        <p className="font-medium text-zinc-100">{o.products?.title ?? "—"}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          {new Date(o.created_at).toLocaleString()}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-medium text-white">{formatNaira(o.price_kobo)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                            o.status === "fulfilled"
                              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                              : "bg-zinc-700/40 text-zinc-300 ring-white/10"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Recent transactions */}
        <section className="mt-10">
          <h2 className="mb-4 font-sora text-lg font-medium text-white">Recent wallet activity</h2>
          <div className="overflow-hidden rounded-2xl bg-vault-surface ring-1 ring-white/5">
            {(data?.txs.length ?? 0) === 0 ? (
              <p className="p-8 text-center text-sm text-zinc-500">No activity yet.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {data?.txs.map((t: any) => (
                    <tr key={t.id} className="border-b border-white/5 last:border-0">
                      <td className="p-4">
                        <p className="font-medium capitalize text-zinc-100">{t.type}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">
                          {new Date(t.created_at).toLocaleString()}
                        </p>
                      </td>
                      <td
                        className={`p-4 text-right font-medium tabular-nums ${
                          t.amount_kobo >= 0 ? "text-emerald-400" : "text-zinc-100"
                        }`}
                      >
                        {t.amount_kobo >= 0 ? "+" : "−"}
                        {formatNaira(Math.abs(t.amount_kobo))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
