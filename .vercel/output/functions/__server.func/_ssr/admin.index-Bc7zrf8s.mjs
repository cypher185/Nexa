import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-Bc7zrf8s.js
var import_jsx_runtime = require_jsx_runtime();
function AdminOverview() {
	const { data } = useQuery({
		queryKey: ["admin", "overview"],
		queryFn: async () => {
			const since = /* @__PURE__ */ new Date();
			since.setDate(since.getDate() - 1);
			const [usersCount, ordersToday, revenueToday, lowStock, recentOrders, lifetimeRevenue] = await Promise.all([
				supabase.from("profiles").select("*", {
					count: "exact",
					head: true
				}),
				supabase.from("orders").select("*", {
					count: "exact",
					head: true
				}).gte("created_at", since.toISOString()),
				supabase.from("orders").select("price_kobo").eq("status", "fulfilled").gte("created_at", since.toISOString()),
				supabase.from("products").select("id, title").eq("is_active", true).limit(50),
				supabase.from("orders").select("id, price_kobo, status, created_at, products(title), profiles:user_id(email)").order("created_at", { ascending: false }).limit(10),
				supabase.from("orders").select("price_kobo").eq("status", "fulfilled")
			]);
			const productIds = (lowStock.data ?? []).map((p) => p.id);
			let lowStockProducts = [];
			if (productIds.length > 0) {
				const counts = await Promise.all(productIds.map(async (pid) => {
					const { count } = await supabase.from("account_stock").select("*", {
						count: "exact",
						head: true
					}).eq("product_id", pid).eq("status", "available");
					return {
						pid,
						count: count ?? 0
					};
				}));
				lowStockProducts = (lowStock.data ?? []).map((p) => ({
					id: p.id,
					title: p.title,
					available: counts.find((c) => c.pid === p.id)?.count ?? 0
				})).filter((p) => p.available < 3).sort((a, b) => a.available - b.available).slice(0, 6);
			}
			return {
				usersCount: usersCount.count ?? 0,
				ordersToday: ordersToday.count ?? 0,
				revenueToday: (revenueToday.data ?? []).reduce((s, o) => s + (o.price_kobo ?? 0), 0),
				lifetimeRevenue: (lifetimeRevenue.data ?? []).reduce((s, o) => s + (o.price_kobo ?? 0), 0),
				recentOrders: recentOrders.data ?? [],
				lowStockProducts
			};
		}
	});
	const stats = [
		{
			label: "Revenue (24h)",
			value: formatNaira(data?.revenueToday)
		},
		{
			label: "Orders (24h)",
			value: (data?.ordersToday ?? 0).toString()
		},
		{
			label: "Lifetime revenue",
			value: formatNaira(data?.lifetimeRevenue)
		},
		{
			label: "Total users",
			value: (data?.usersCount ?? 0).toString()
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-zinc-500",
				children: "Admin"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-sora text-3xl font-semibold text-white",
				children: "Overview"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-vault-surface p-5 ring-1 ring-white/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-zinc-500",
						children: s.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-sora text-2xl font-semibold text-white tabular-nums",
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-sora text-lg font-medium text-white",
					children: "Recent orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/orders",
					className: "text-xs text-vault-gold-light hover:underline",
					children: "View all →"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[560px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "User"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "When"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [(data?.recentOrders ?? []).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-white/5 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-300",
								children: o.profiles?.email ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-200",
								children: o.products?.title ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right font-medium text-white",
								children: formatNaira(o.price_kobo)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right text-xs capitalize text-zinc-400",
								children: o.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right text-[11px] text-zinc-500",
								children: new Date(o.created_at).toLocaleString()
							})
						]
					}, o.id)), (data?.recentOrders ?? []).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "p-8 text-center text-sm text-zinc-500",
						children: "No orders yet."
					}) })] })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-4 font-sora text-lg font-medium text-white",
				children: "Low stock"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3",
				children: (data?.lowStockProducts ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-dashed border-white/10 p-6 text-sm text-zinc-500",
					children: "Nothing low. Stock is healthy."
				}) : data?.lowStockProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/products",
					className: "flex items-center justify-between rounded-xl bg-vault-surface p-4 ring-1 ring-white/5 hover:ring-vault-gold/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-zinc-100 line-clamp-1",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.available === 0 ? "bg-red-500/10 text-red-400 ring-1 ring-red-500/20" : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"}`,
						children: [p.available, " left"]
					})]
				}, p.id))
			})] })
		]
	});
}
//#endregion
export { AdminOverview as component };
