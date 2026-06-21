import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 1);
      const [usersCount, ordersToday, revenueToday, lowStock, recentOrders, lifetimeRevenue] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gte("created_at", since.toISOString()),
        supabase
          .from("orders")
          .select("price_kobo")
          .eq("status", "fulfilled")
          .gte("created_at", since.toISOString()),
        supabase
          .from("products")
          .select("id, title")
          .eq("is_active", true)
          .limit(50),
        supabase
          .from("orders")
          .select("id, price_kobo, status, created_at, products(title), profiles:user_id(email)")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("orders").select("price_kobo").eq("status", "fulfilled"),
      ]);

      // low stock = any active product with 0 available
      const productIds = (lowStock.data ?? []).map((p) => p.id);
      let lowStockProducts: Array<{ id: string; title: string; available: number }> = [];
      if (productIds.length > 0) {
        const counts = await Promise.all(
          productIds.map(async (pid) => {
            const { count } = await supabase
              .from("account_stock")
              .select("*", { count: "exact", head: true })
              .eq("product_id", pid)
              .eq("status", "available");
            return { pid, count: count ?? 0 };
          }),
        );
        lowStockProducts = (lowStock.data ?? [])
          .map((p) => ({
            id: p.id,
            title: p.title,
            available: counts.find((c) => c.pid === p.id)?.count ?? 0,
          }))
          .filter((p) => p.available < 3)
          .sort((a, b) => a.available - b.available)
          .slice(0, 6);
      }

      return {
        usersCount: usersCount.count ?? 0,
        ordersToday: ordersToday.count ?? 0,
        revenueToday:
          (revenueToday.data ?? []).reduce((s, o: any) => s + (o.price_kobo ?? 0), 0),
        lifetimeRevenue:
          (lifetimeRevenue.data ?? []).reduce((s, o: any) => s + (o.price_kobo ?? 0), 0),
        recentOrders: recentOrders.data ?? [],
        lowStockProducts,
      };
    },
  });

  const stats = [
    { label: "Revenue (24h)", value: formatNaira(data?.revenueToday) },
    { label: "Orders (24h)", value: (data?.ordersToday ?? 0).toString() },
    { label: "Lifetime revenue", value: formatNaira(data?.lifetimeRevenue) },
    { label: "Total users", value: (data?.usersCount ?? 0).toString() },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Admin</p>
        <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Overview</h1>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-vault-surface p-5 ring-1 ring-white/5">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">{s.label}</p>
            <p className="mt-2 font-sora text-2xl font-semibold text-white tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-sora text-lg font-medium text-white">Recent orders</h2>
          <Link to="/admin/orders" className="text-xs text-vault-gold-light hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Product</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Status</th>
                <th className="p-4 text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders ?? []).map((o: any) => (
                <tr key={o.id} className="border-b border-white/5 last:border-0">
                  <td className="p-4 text-zinc-300">{o.profiles?.email ?? "—"}</td>
                  <td className="p-4 text-zinc-200">{o.products?.title ?? "—"}</td>
                  <td className="p-4 text-right font-medium text-white">{formatNaira(o.price_kobo)}</td>
                  <td className="p-4 text-right text-xs capitalize text-zinc-400">{o.status}</td>
                  <td className="p-4 text-right text-[11px] text-zinc-500">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {(data?.recentOrders ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-zinc-500">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-sora text-lg font-medium text-white">Low stock</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(data?.lowStockProducts ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-zinc-500">
              Nothing low. Stock is healthy.
            </div>
          ) : (
            data?.lowStockProducts.map((p) => (
              <Link
                key={p.id}
                to="/admin/products"
                className="flex items-center justify-between rounded-xl bg-vault-surface p-4 ring-1 ring-white/5 hover:ring-vault-gold/30"
              >
                <span className="text-sm text-zinc-100 line-clamp-1">{p.title}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    p.available === 0
                      ? "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                      : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                  }`}
                >
                  {p.available} left
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
