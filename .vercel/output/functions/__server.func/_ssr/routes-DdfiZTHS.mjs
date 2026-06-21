import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./use-auth-7T2UG58p.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as ArrowRight, d as ShieldCheck, t as Zap, w as Headphones } from "../_libs/lucide-react.mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-chrome-Bb2gtJDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DdfiZTHS.js
var import_jsx_runtime = require_jsx_runtime();
var accentColors = {
	blue: "bg-blue-600/10 text-blue-400 ring-blue-500/20",
	pink: "bg-pink-600/10 text-pink-400 ring-pink-500/20",
	cyan: "bg-cyan-600/10 text-cyan-400 ring-cyan-500/20",
	white: "bg-white/5 text-white ring-white/10",
	amber: "bg-amber-600/10 text-amber-400 ring-amber-500/20",
	red: "bg-red-600/10 text-red-400 ring-red-500/20",
	sky: "bg-sky-600/10 text-sky-400 ring-sky-500/20",
	yellow: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
};
function accentClass(a) {
	return accentColors[a ?? "white"] ?? accentColors.white;
}
async function fetchHomeData() {
	const { data: cats } = await supabase.from("categories").select("id, slug, name, description, icon, accent, sort_order").eq("is_active", true).order("sort_order");
	const categories = cats ?? [];
	const categoryProducts = await Promise.all(categories.map(async (c) => {
		const { data: prods } = await supabase.from("products").select("id, price_kobo").eq("category_id", c.id).eq("is_active", true);
		return {
			c,
			prods: prods ?? []
		};
	}));
	const allProductIds = categoryProducts.flatMap(({ prods }) => prods.map((p) => p.id));
	const stockMap = /* @__PURE__ */ new Map();
	if (allProductIds.length > 0) {
		const { data: counts } = await supabase.rpc("get_available_stock", { _product_ids: allProductIds });
		(counts ?? []).forEach((row) => {
			stockMap.set(row.product_id, Number(row.available_count));
		});
	}
	const stats = categoryProducts.map(({ c, prods }) => {
		const stock = prods.reduce((sum, p) => sum + (stockMap.get(p.id) ?? 0), 0);
		const starting = prods.length > 0 ? Math.min(...prods.map((p) => p.price_kobo)) : null;
		return {
			...c,
			starting_price_kobo: starting,
			stock_count: stock
		};
	});
	const { data: featuredProducts } = await supabase.from("products").select("id, title, description, price_kobo, metadata, category_id, categories(name, slug, accent)").eq("is_active", true).order("created_at", { ascending: false }).limit(6);
	return {
		categories: stats,
		featured: featuredProducts ?? []
	};
}
function Landing() {
	const { user } = useAuth();
	const { data, isLoading } = useQuery({
		queryKey: ["home"],
		queryFn: fetchHomeData
	});
	const categories = data?.categories ?? [];
	const featured = data?.featured ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg font-manrope text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "space-y-24 py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative mx-auto max-w-7xl px-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-vault-gold/10 blur-[120px]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-zinc-900/50 px-3 py-1 text-xs font-medium tracking-wide text-zinc-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-vault-gold-light",
									children: "New"
								}), " Verified Nigerian Gmail accounts in stock"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mx-auto mb-6 max-w-[20ch] font-sora text-5xl font-semibold leading-none tracking-tight text-balance text-zinc-100 md:text-6xl",
								children: [
									"Premium aged social accounts,",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "gold-text",
										children: "delivered instantly"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto max-w-[56ch] text-lg text-pretty text-zinc-400",
								children: "The most reliable secondary market for aged digital assets in Nigeria. Fund your wallet, browse the vault, and own a verified account in seconds."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 flex flex-wrap justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/browse",
									className: "rounded-xl bg-vault-gold px-7 py-3.5 text-sm font-semibold text-vault-bg transition-colors hover:bg-vault-gold-light",
									children: "Browse the vault"
								}), !user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auth",
									search: { mode: "signup" },
									className: "rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10",
									children: "Create account"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-7xl px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8 flex items-end justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-sora text-2xl font-medium text-zinc-100",
								children: "Browse categories"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-zinc-500",
								children: "Pick a platform. Buy in seconds."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/browse",
								className: "text-sm font-medium text-vault-gold hover:text-vault-gold-light",
								children: "View all →"
							})]
						}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4",
							children: categories.slice(0, 8).map((c, i) => {
								const big = i === 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/category/$slug",
									params: { slug: c.slug },
									className: `group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-vault-surface p-6 ring-1 ring-black/5 transition hover:bg-zinc-800/80 hover:ring-vault-gold/20 ${big ? "col-span-2 row-span-2 p-8 md:min-h-[320px]" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-vault-gold/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative z-10",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `mb-4 flex ${big ? "size-12" : "size-10"} items-center justify-center rounded-xl ring-1 ${accentClass(c.accent)}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-sora text-sm font-semibold lowercase",
														children: c.icon ?? c.name[0]
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: `font-sora ${big ? "text-2xl" : "text-lg"} font-medium text-white`,
													children: c.name
												}),
												big && c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 max-w-[28ch] text-sm text-zinc-400",
													children: c.description
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative z-10 mt-6 flex items-end justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[10px] font-medium uppercase tracking-widest text-zinc-500",
												children: big ? "Starting at" : "From"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-semibold text-vault-gold-light ${big ? "text-2xl" : "text-base"}`,
												children: c.starting_price_kobo !== null ? formatNaira(c.starting_price_kobo) : "—"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-zinc-500",
												children: c.stock_count > 0 ? `${c.stock_count.toLocaleString()} in stock` : "Restocking"
											})]
										})
									]
								}, c.id);
							})
						})]
					}),
					featured.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-7xl px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-10 flex items-end justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-sora text-2xl font-medium text-zinc-100",
									children: "Newest arrivals"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-zinc-500",
									children: "Fresh stock added to the vault."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/browse",
								className: "text-sm font-medium text-vault-gold hover:text-vault-gold-light",
								children: "View all listings"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-6 md:grid-cols-3",
							children: featured.slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/account/$id",
								params: { id: p.id },
								className: "group flex flex-col overflow-hidden rounded-2xl bg-vault-surface ring-1 ring-black/5 transition hover:ring-vault-gold/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-6 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `grid size-10 place-items-center rounded-lg ring-1 ${accentClass(p.categories?.accent)}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-sora text-xs font-semibold",
													children: p.categories?.name?.[0] ?? "·"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium text-zinc-100 line-clamp-1",
												children: p.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] uppercase tracking-tighter text-zinc-500",
												children: p.categories?.name
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20",
											children: "Available"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs leading-relaxed text-zinc-500 line-clamp-3",
										children: p.description || "Verified asset with clean history."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto flex items-center justify-between border-t border-white/5 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-sora text-lg font-medium text-white",
										children: formatNaira(p.price_kobo)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-lg bg-vault-gold px-4 py-2 text-sm font-medium text-vault-bg transition-colors group-hover:bg-vault-gold-light",
										children: ["View ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
									})]
								})]
							}, p.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "border-y border-white/5 bg-vault-surface/50 py-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3",
							children: [
								{
									icon: Zap,
									title: "Instant fulfilment",
									body: "Credentials revealed in your dashboard the moment payment confirms."
								},
								{
									icon: ShieldCheck,
									title: "Wallet-secured",
									body: "Korapay-funded wallet keeps every purchase atomic. No half-transactions."
								},
								{
									icon: Headphones,
									title: "Naija-first support",
									body: "Real humans on WhatsApp & email. Disputes handled fast."
								}
							].map(({ icon: Icon, title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 shrink-0 place-items-center rounded-xl bg-vault-gold/10 ring-1 ring-vault-gold/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-vault-gold-light" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-sora text-sm font-medium text-white",
									children: title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-zinc-500",
									children: body
								})] })]
							}, title))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mx-auto max-w-7xl px-6 pb-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl bg-gradient-to-br from-zinc-900 to-vault-bg p-10 text-center ring-1 ring-white/5 md:p-14",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mb-4 font-sora text-3xl font-medium text-white md:text-4xl",
									children: "Ready to scale your presence?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mb-10 max-w-[48ch] text-zinc-400",
									children: "Top up your NexaLogs wallet via Korapay and start acquiring premium digital assets today."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/fund",
										className: "rounded-xl bg-vault-gold px-8 py-4 text-sm font-semibold text-vault-bg transition active:scale-[0.98] hover:bg-vault-gold-light gold-glow",
										children: "Fund wallet now"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/browse",
										className: "rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white hover:bg-white/10",
										children: "Browse all categories"
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function BentoSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-4 md:grid-cols-4",
		children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-40 animate-pulse rounded-2xl bg-vault-surface ${i === 0 ? "col-span-2 row-span-2 h-auto md:min-h-[320px]" : ""}` }, i))
	});
}
//#endregion
export { Landing as component };
