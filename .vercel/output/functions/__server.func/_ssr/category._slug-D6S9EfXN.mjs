import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { b as useParams, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-chrome-Bb2gtJDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-D6S9EfXN.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { slug } = useParams({ from: "/category/$slug" });
	const { data, isLoading } = useQuery({
		queryKey: ["category", slug],
		queryFn: async () => {
			const { data: cat } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
			if (!cat) return {
				cat: null,
				prods: []
			};
			const { data: prods } = await supabase.from("products").select("id, title, description, price_kobo, metadata").eq("category_id", cat.id).eq("is_active", true).order("created_at", { ascending: false });
			return {
				cat,
				prods: prods ?? []
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/browse",
					className: "mb-6 inline-block text-xs text-zinc-500 hover:text-vault-gold-light",
					children: "← All categories"
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-2xl bg-vault-surface" }) : !data?.cat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-400",
					children: "Category not found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-sora text-4xl font-semibold text-white",
						children: data.cat.name
					}), data.cat.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-zinc-500",
						children: data.cat.description
					})]
				}), data.prods.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-dashed border-white/10 p-12 text-center text-zinc-400",
					children: "No listings in this category yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: data.prods.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/account/$id",
						params: { id: p.id },
						className: "group flex flex-col rounded-2xl bg-vault-surface p-6 ring-1 ring-black/5 transition hover:ring-vault-gold/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-sora text-base font-medium text-white line-clamp-2",
								children: p.title
							}),
							p.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-3 text-xs text-zinc-500",
								children: p.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto flex items-end justify-between border-t border-white/5 pt-4 mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-sora text-lg font-semibold text-vault-gold-light",
									children: formatNaira(p.price_kobo)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-vault-gold group-hover:underline",
									children: "View →"
								})]
							})
						]
					}, p.id))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { CategoryPage as component };
