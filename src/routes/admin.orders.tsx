import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersAdmin,
});

function OrdersAdmin() {
  const { data } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from("orders")
        .select("id, user_id, price_kobo, status, created_at, products(title)")
        .order("created_at", { ascending: false })
        .limit(200);
      const list = orders ?? [];
      if (list.length === 0) return [];
      const ids = Array.from(new Set(list.map((o: any) => o.user_id)));
      const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", ids);
      const emailMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.email]));
      return list.map((o: any) => ({ ...o, user_email: emailMap[o.user_id] ?? "—" }));
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">Operations</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Account orders</h1>
          <p className="mt-1 text-xs text-zinc-500">Accounts-from-stock purchases. For social-boost orders, see <Link to="/admin/smm-orders" className="text-vault-gold-light hover:underline">SMM Orders</Link>.</p>
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">User</th>
              <th className="p-4">Product</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-right">Status</th>
              <th className="p-4 text-right">When</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No orders.</td></tr>
            ) : data?.map((o: any) => (
              <tr key={o.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 font-mono text-[11px] text-zinc-500">{o.id.slice(0, 8)}</td>
                <td className="p-4 text-zinc-300">{o.user_email}</td>
                <td className="p-4 text-zinc-200">{o.products?.title ?? "—"}</td>
                <td className="p-4 text-right font-medium text-white">{formatNaira(o.price_kobo)}</td>
                <td className="p-4 text-right">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                    o.status === "fulfilled" ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" :
                    o.status === "refunded" ? "bg-amber-500/10 text-amber-400 ring-amber-500/20" :
                    o.status === "failed" ? "bg-red-500/10 text-red-400 ring-red-500/20" :
                    "bg-zinc-700/40 text-zinc-300 ring-white/10"
                  }`}>{o.status}</span>
                </td>
                <td className="p-4 text-right text-[11px] text-zinc-500">
                  {new Date(o.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
