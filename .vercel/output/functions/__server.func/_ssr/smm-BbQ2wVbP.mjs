import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as ArrowRight, p as Search } from "../_libs/lucide-react.mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-chrome-Bb2gtJDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smm-BbQ2wVbP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_NGN_PER_USD = 1600;
function SmmCatalog() {
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("");
	const { data: rate } = useQuery({
		queryKey: ["smm-rate"],
		queryFn: async () => {
			const { data } = await supabase.from("site_settings").select("value").eq("key", "smm_ngn_per_usd").maybeSingle();
			return Number((data?.value)?.value) || DEFAULT_NGN_PER_USD;
		}
	});
	const { data: categories } = useQuery({
		queryKey: ["smm-categories-public"],
		queryFn: async () => (await supabase.from("smm_categories").select("*").order("sort_order")).data ?? []
	});
	const { data: services, isLoading } = useQuery({
		queryKey: ["smm-services-public"],
		queryFn: async () => (await supabase.from("smm_services").select("id, name, type, rate_usd_per_1000, markup_pct, min_qty, max_qty, category_id, provider_category, smm_categories(name, logo_url)").order("name").limit(2e3)).data ?? []
	});
	const ngnPerUsd = rate ?? DEFAULT_NGN_PER_USD;
	const filtered = (0, import_react.useMemo)(() => {
		return (services ?? []).filter((s) => {
			if (cat && s.category_id !== cat) return false;
			if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
			return true;
		});
	}, [
		services,
		q,
		cat
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-widest text-vault-gold",
								children: "SMM Services"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-sora text-3xl sm:text-4xl font-semibold text-white",
								children: "Grow any social profile, instantly."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-2xl text-sm text-zinc-400",
								children: "Followers, likes, views, comments and more — paid from your NexaLogs wallet. Orders auto-place against our panel network and progress is tracked in real time."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: q,
									onChange: (e) => setQ(e.target.value),
									placeholder: "Search e.g. Instagram followers",
									className: "w-72 rounded-lg border border-white/10 bg-vault-surface pl-10 pr-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: cat,
								onChange: (e) => setCat(e.target.value),
								className: "rounded-lg border border-white/10 bg-vault-surface px-3 py-2 text-sm text-white outline-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All categories"
								}), categories?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-zinc-500",
								children: [
									filtered.length,
									" service",
									filtered.length === 1 ? "" : "s"
								]
							})
						]
					}),
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-zinc-500",
						children: "Loading…"
					}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl bg-vault-surface p-10 text-center ring-1 ring-white/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-zinc-400",
							children: "No services available yet. Check back soon."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: filtered.map((s) => {
							const ngnPer1k = Math.ceil(Number(s.rate_usd_per_1000) * ngnPerUsd * (1 + Number(s.markup_pct) / 100));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/smm/$serviceId",
								params: { serviceId: s.id },
								resetScroll: false,
								className: "group rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5 transition hover:bg-vault-surface/70 hover:ring-vault-gold/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [s.smm_categories?.logo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: s.smm_categories.logo_url,
											alt: "",
											className: "size-6 rounded object-contain"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-widest text-zinc-500",
											children: s.smm_categories?.name ?? s.provider_category ?? s.type ?? "Service"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-sm font-medium text-white",
										children: s.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex items-end justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-widest text-zinc-500",
											children: "per 1,000"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-sora text-lg text-vault-gold-light",
											children: formatNaira(ngnPer1k * 100)
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-zinc-500 transition group-hover:text-vault-gold-light" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-[10px] text-zinc-500",
										children: [
											"Min ",
											s.min_qty.toLocaleString(),
											" · Max ",
											s.max_qty.toLocaleString()
										]
									})
								]
							}, s.id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { SmmCatalog as component };
