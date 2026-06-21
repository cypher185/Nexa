import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-B38y6Tpj.js
var import_jsx_runtime = require_jsx_runtime();
function OrdersAdmin() {
	const { data } = useQuery({
		queryKey: ["admin", "orders"],
		queryFn: async () => {
			const { data: orders } = await supabase.from("orders").select("id, user_id, price_kobo, status, created_at, products(title)").order("created_at", { ascending: false }).limit(200);
			const list = orders ?? [];
			if (list.length === 0) return [];
			const ids = Array.from(new Set(list.map((o) => o.user_id)));
			const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", ids);
			const emailMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.email]));
			return list.map((o) => ({
				...o,
				user_email: emailMap[o.user_id] ?? "—"
			}));
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-zinc-500",
					children: "Operations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-sora text-3xl font-semibold text-white",
					children: "Account orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-zinc-500",
					children: [
						"Accounts-from-stock purchases. For social-boost orders, see ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/smm-orders",
							className: "text-vault-gold-light hover:underline",
							children: "SMM Orders"
						}),
						"."
					]
				})
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-4",
							children: "Order"
						}),
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "p-8 text-center text-zinc-500",
					children: "No orders."
				}) }) : data?.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-white/5 last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 font-mono text-[11px] text-zinc-500",
							children: o.id.slice(0, 8)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 text-zinc-300",
							children: o.user_email
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
							className: "p-4 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${o.status === "fulfilled" ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : o.status === "refunded" ? "bg-amber-500/10 text-amber-400 ring-amber-500/20" : o.status === "failed" ? "bg-red-500/10 text-red-400 ring-red-500/20" : "bg-zinc-700/40 text-zinc-300 ring-white/10"}`,
								children: o.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 text-right text-[11px] text-zinc-500",
							children: new Date(o.created_at).toLocaleString()
						})
					]
				}, o.id)) })]
			})
		})]
	});
}
//#endregion
export { OrdersAdmin as component };
