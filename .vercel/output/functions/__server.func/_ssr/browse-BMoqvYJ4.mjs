import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-chrome-Bb2gtJDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/browse-BMoqvYJ4.js
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
function Browse() {
	const { data, isLoading } = useQuery({
		queryKey: ["browse"],
		queryFn: async () => {
			const { data: cats } = await supabase.from("categories").select("id, slug, name, description, icon, accent").eq("is_active", true).order("sort_order");
			const { data: prods } = await supabase.from("products").select("id, title, price_kobo, category_id, metadata, categories(name, slug, accent)").eq("is_active", true).order("created_at", { ascending: false });
			return {
				cats: cats ?? [],
				prods: prods ?? []
			};
		}
	});
	const cats = data?.cats ?? [];
	const prods = data?.prods ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-6 py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-sora text-4xl font-semibold text-white",
							children: "Marketplace"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-zinc-500",
							children: "Every aged account in the NexaLogs vault, organised by platform."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-12 flex flex-wrap gap-2",
						children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: c.slug },
							className: "rounded-full border border-white/10 bg-vault-surface px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-vault-gold/30 hover:text-vault-gold-light",
							children: c.name
						}, c.id))
					}),
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 animate-pulse rounded-2xl bg-vault-surface" }, i))
					}) : prods.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-dashed border-white/10 p-12 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-zinc-400",
							children: "No products listed yet. Check back soon."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: prods.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/account/$id",
							params: { id: p.id },
							className: "group rounded-2xl bg-vault-surface p-5 ring-1 ring-black/5 transition hover:ring-vault-gold/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-5 flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `grid size-10 place-items-center rounded-lg ring-1 ${accentColors[p.categories?.accent ?? "white"] ?? accentColors.white}`,
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
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-end justify-between border-t border-white/5 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-sora text-lg font-semibold text-white",
									children: formatNaira(p.price_kobo)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-vault-gold-light group-hover:underline",
									children: "View →"
								})]
							})]
						}, p.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Browse as component };
