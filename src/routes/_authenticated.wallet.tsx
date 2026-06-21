import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNaira, formatNairaDecimal } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/wallet")({
  component: WalletPage,
});

function WalletPage() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["wallet", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [wallet, txs] = await Promise.all([
        supabase.from("wallets").select("balance_kobo").eq("user_id", user!.id).maybeSingle(),
        supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(100),
      ]);
      return { balance: wallet.data?.balance_kobo ?? 0, txs: txs.data ?? [] };
    },
  });

  return (
    <div className="min-h-screen bg-vault-bg text-zinc-300">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Wallet</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">
            {formatNairaDecimal(data?.balance)}
          </h1>
        </header>

        <div className="overflow-hidden rounded-2xl bg-vault-surface ring-1 ring-white/5">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Status</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {(data?.txs ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm text-zinc-500">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                data?.txs.map((t: any) => (
                  <tr key={t.id} className="border-b border-white/5 last:border-0">
                    <td className="p-4 capitalize text-zinc-100">{t.type}</td>
                    <td className="p-4 text-zinc-400">{t.description ?? "—"}</td>
                    <td
                      className={`p-4 text-right font-medium tabular-nums ${
                        t.amount_kobo >= 0 ? "text-emerald-400" : "text-zinc-100"
                      }`}
                    >
                      {t.amount_kobo >= 0 ? "+" : "−"}
                      {formatNaira(Math.abs(t.amount_kobo))}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                          t.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                            : t.status === "pending"
                              ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                              : "bg-red-500/10 text-red-400 ring-red-500/20"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[11px] text-zinc-500">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
