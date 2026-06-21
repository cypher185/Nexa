import { n as supabase } from "./_ssr/client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/use-auth-7T2UG58p.mjs";
import { n as formatNairaDecimal, t as formatNaira } from "./_ssr/format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./_ssr/site-chrome-Bb2gtJDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated.wallet-CP5EMk75.js
var import_jsx_runtime = require_jsx_runtime();
function WalletPage() {
	const { user } = useAuth();
	const { data } = useQuery({
		queryKey: ["wallet", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const [wallet, txs] = await Promise.all([supabase.from("wallets").select("balance_kobo").eq("user_id", user.id).maybeSingle(), supabase.from("wallet_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100)]);
			return {
				balance: wallet.data?.balance_kobo ?? 0,
				txs: txs.data ?? []
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-zinc-500",
						children: "Wallet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-sora text-3xl font-semibold text-white",
						children: formatNairaDecimal(data?.balance)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl bg-vault-surface ring-1 ring-white/5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-white/5 text-left text-xs uppercase tracking-wide text-zinc-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-4",
									children: "Description"
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
									children: "Date"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data?.txs ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "p-12 text-center text-sm text-zinc-500",
							children: "No transactions yet."
						}) }) : data?.txs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-white/5 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 capitalize text-zinc-100",
									children: t.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-zinc-400",
									children: t.description ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: `p-4 text-right font-medium tabular-nums ${t.amount_kobo >= 0 ? "text-emerald-400" : "text-zinc-100"}`,
									children: [t.amount_kobo >= 0 ? "+" : "−", formatNaira(Math.abs(t.amount_kobo))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${t.status === "success" ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : t.status === "pending" ? "bg-amber-500/10 text-amber-400 ring-amber-500/20" : "bg-red-500/10 text-red-400 ring-red-500/20"}`,
										children: t.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-right text-[11px] text-zinc-500",
									children: new Date(t.created_at).toLocaleString()
								})
							]
						}, t.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { WalletPage as component };
