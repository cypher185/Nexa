import { n as supabase } from "./_ssr/client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/use-auth-7T2UG58p.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as Wallet, c as ShoppingBag, h as Plus } from "./_libs/lucide-react.mjs";
import { n as formatNairaDecimal, t as formatNaira } from "./_ssr/format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./_ssr/site-chrome-Bb2gtJDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated.dashboard-7_UppGHV.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { user } = useAuth();
	const { data } = useQuery({
		queryKey: ["dashboard", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const [wallet, recentOrders, recentTx] = await Promise.all([
				supabase.from("wallets").select("balance_kobo").eq("user_id", user.id).maybeSingle(),
				supabase.from("orders").select("id, price_kobo, status, created_at, products(title)").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
				supabase.from("wallet_transactions").select("id, type, amount_kobo, status, created_at, description").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
			]);
			return {
				balance: wallet.data?.balance_kobo ?? 0,
				orders: recentOrders.data ?? [],
				txs: recentTx.data ?? []
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-6 py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-zinc-500",
							children: "Welcome back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-sora text-3xl font-semibold text-white",
							children: user?.user_metadata?.full_name || user?.email
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-vault-surface to-vault-bg p-8 ring-1 ring-vault-gold/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-12 -right-12 size-60 rounded-full bg-vault-gold/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs uppercase tracking-widest text-vault-gold-light",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" }), "Wallet balance"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 font-sora text-5xl font-semibold text-white tabular-nums",
										children: formatNairaDecimal(data?.balance)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/fund",
											className: "inline-flex items-center gap-2 rounded-xl bg-vault-gold px-5 py-2.5 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Fund wallet"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/wallet",
											className: "rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10",
											children: "Wallet history"
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/purchases",
							className: "group flex flex-col justify-between rounded-3xl bg-vault-surface p-8 ring-1 ring-white/5 hover:ring-vault-gold/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-6 text-vault-gold-light" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-widest text-zinc-500",
									children: "My accounts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-sora text-2xl font-semibold text-white",
									children: [data?.orders?.filter((o) => o.status === "fulfilled").length ?? 0, " owned"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-vault-gold group-hover:underline",
									children: "View all →"
								})
							] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-4 font-sora text-lg font-medium text-white",
							children: "Recent purchases"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-2xl bg-vault-surface ring-1 ring-white/5",
							children: (data?.orders.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "p-8 text-center text-sm text-zinc-500",
								children: [
									"No purchases yet.",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/browse",
										className: "text-vault-gold-light",
										children: "Browse the vault →"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
								className: "w-full text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data?.orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-white/5 last:border-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-zinc-100",
												children: o.products?.title ?? "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-[11px] text-zinc-500",
												children: new Date(o.created_at).toLocaleString()
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-white",
												children: formatNaira(o.price_kobo)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${o.status === "fulfilled" ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-zinc-700/40 text-zinc-300 ring-white/10"}`,
												children: o.status
											})
										})
									]
								}, o.id)) })
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-4 font-sora text-lg font-medium text-white",
							children: "Recent wallet activity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-2xl bg-vault-surface ring-1 ring-white/5",
							children: (data?.txs.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-8 text-center text-sm text-zinc-500",
								children: "No activity yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
								className: "w-full text-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data?.txs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-white/5 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium capitalize text-zinc-100",
											children: t.type
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-[11px] text-zinc-500",
											children: new Date(t.created_at).toLocaleString()
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: `p-4 text-right font-medium tabular-nums ${t.amount_kobo >= 0 ? "text-emerald-400" : "text-zinc-100"}`,
										children: [t.amount_kobo >= 0 ? "+" : "−", formatNaira(Math.abs(t.amount_kobo))]
									})]
								}, t.id)) })
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Dashboard as component };
