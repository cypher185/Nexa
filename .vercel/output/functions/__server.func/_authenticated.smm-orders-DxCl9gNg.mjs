import { n as supabase } from "./_ssr/client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/use-auth-7T2UG58p.mjs";
import { t as formatNaira } from "./_ssr/format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./_ssr/site-chrome-Bb2gtJDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated.smm-orders-DxCl9gNg.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLORS = {
	pending: "bg-amber-500/10 text-amber-400",
	in_progress: "bg-sky-500/10 text-sky-400",
	completed: "bg-emerald-500/10 text-emerald-400",
	partial: "bg-orange-500/10 text-orange-400",
	canceled: "bg-zinc-500/10 text-zinc-400",
	refunded: "bg-zinc-500/10 text-zinc-400",
	failed: "bg-red-500/10 text-red-400"
};
function MySmmOrders() {
	const { user } = useAuth();
	const { data } = useQuery({
		enabled: !!user,
		queryKey: ["my-smm-orders", user?.id],
		refetchInterval: 15e3,
		queryFn: async () => (await supabase.from("smm_orders").select("*, smm_services(name)").order("created_at", { ascending: false }).limit(200)).data ?? []
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-vault-gold",
					children: "SMM"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white",
					children: "My SMM Orders"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[720px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "When"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Service"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Link"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-right",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-right",
									children: "Remains"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-right",
									children: "Charge"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-right",
									children: "Refunded"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-center",
									children: "Status"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 8,
							className: "p-8 text-center text-zinc-500",
							children: "No SMM orders yet."
						}) }) : data?.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-white/5 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-[11px] text-zinc-500",
									children: new Date(o.created_at).toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-xs text-zinc-200",
									children: o.smm_services?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-xs text-zinc-400 max-w-[180px] truncate",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: o.link,
										target: "_blank",
										rel: "noreferrer",
										className: "hover:text-vault-gold-light",
										children: o.link
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right tabular-nums text-zinc-300",
									children: o.quantity.toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right tabular-nums text-zinc-400",
									children: o.remains ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right tabular-nums text-zinc-100",
									children: formatNaira(o.charge_kobo)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right tabular-nums text-emerald-400",
									children: o.refund_kobo ? formatNaira(o.refund_kobo) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[o.status] ?? "bg-zinc-500/10 text-zinc-400"}`,
										children: o.status.replace("_", " ")
									})
								})
							]
						}, o.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { MySmmOrders as component };
