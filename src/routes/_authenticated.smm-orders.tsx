import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/smm-orders")({
  component: MySmmOrders,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  in_progress: "bg-sky-500/10 text-sky-400",
  completed: "bg-emerald-500/10 text-emerald-400",
  partial: "bg-orange-500/10 text-orange-400",
  canceled: "bg-zinc-500/10 text-zinc-400",
  refunded: "bg-zinc-500/10 text-zinc-400",
  failed: "bg-red-500/10 text-red-400",
};

function MySmmOrders() {
  const { user } = useAuth();
  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["my-smm-orders", user?.id],
    refetchInterval: 15000,
    queryFn: async () => (
      await supabase.from("smm_orders").select("*, smm_services(name)").order("created_at", { ascending: false }).limit(200)
    ).data ?? [],
  });

  return (
    <div className="min-h-screen bg-vault-bg">
      <SiteHeader />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6">
        <header>
          <p className="text-xs uppercase tracking-widest text-vault-gold">SMM</p>
          <h1 className="mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white">My SMM Orders</h1>
        </header>

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">Service</th>
              <th className="p-3">Link</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Remains</th>
              <th className="p-3 text-right">Charge</th>
              <th className="p-3 text-right">Refunded</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-zinc-500">No SMM orders yet.</td></tr>
            ) : data?.map((o: any) => (
              <tr key={o.id} className="border-b border-white/5 last:border-0">
                <td className="p-3 text-[11px] text-zinc-500">{new Date(o.created_at).toLocaleString()}</td>
                <td className="p-3 text-xs text-zinc-200">{o.smm_services?.name ?? "—"}</td>
                <td className="p-3 text-xs text-zinc-400 max-w-[180px] truncate"><a href={o.link} target="_blank" rel="noreferrer" className="hover:text-vault-gold-light">{o.link}</a></td>
                <td className="p-3 text-right tabular-nums text-zinc-300">{o.quantity.toLocaleString()}</td>
                <td className="p-3 text-right tabular-nums text-zinc-400">{o.remains ?? "—"}</td>
                <td className="p-3 text-right tabular-nums text-zinc-100">{formatNaira(o.charge_kobo)}</td>
                <td className="p-3 text-right tabular-nums text-emerald-400">{o.refund_kobo ? formatNaira(o.refund_kobo) : "—"}</td>
                <td className="p-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[o.status] ?? "bg-zinc-500/10 text-zinc-400"}`}>
                    {o.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
