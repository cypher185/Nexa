import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as Plus, n as X, s as Trash2 } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-B_fuD3UE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoriesAdmin() {
	const qc = useQueryClient();
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		slug: "",
		description: "",
		icon: "",
		accent: "white",
		sort_order: 0
	});
	const { data, isLoading } = useQuery({
		queryKey: ["admin", "categories"],
		queryFn: async () => {
			const { data } = await supabase.from("categories").select("*").order("sort_order");
			return data ?? [];
		}
	});
	const reset = () => {
		setForm({
			name: "",
			slug: "",
			description: "",
			icon: "",
			accent: "white",
			sort_order: 0
		});
		setAdding(false);
	};
	const create = async () => {
		if (!form.name || !form.slug) return toast.error("Name and slug required");
		const { error } = await supabase.from("categories").insert(form);
		if (error) return toast.error(error.message);
		toast.success("Category created");
		reset();
		qc.invalidateQueries({ queryKey: ["admin", "categories"] });
	};
	const toggle = async (id, is_active) => {
		await supabase.from("categories").update({ is_active: !is_active }).eq("id", id);
		qc.invalidateQueries({ queryKey: ["admin", "categories"] });
	};
	const del = async (id) => {
		if (!confirm("Delete this category? Products inside will block deletion.")) return;
		const { error } = await supabase.from("categories").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		qc.invalidateQueries({ queryKey: ["admin", "categories"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-zinc-500",
					children: "Catalog"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-sora text-3xl font-semibold text-white",
					children: "Categories"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setAdding(true),
					className: "inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New category"]
				})]
			}),
			adding && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: reset,
						className: "absolute right-4 top-4 text-zinc-500 hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								label: "Name",
								value: form.name,
								onChange: (v) => setForm({
									...form,
									name: v,
									slug: form.slug || slugify(v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								label: "Slug",
								value: form.slug,
								onChange: (v) => setForm({
									...form,
									slug: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								label: "Icon (1-3 chars)",
								value: form.icon,
								onChange: (v) => setForm({
									...form,
									icon: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Accent color",
								value: form.accent,
								onChange: (v) => setForm({
									...form,
									accent: v
								}),
								options: [
									"white",
									"blue",
									"pink",
									"cyan",
									"amber",
									"red",
									"sky",
									"yellow"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								label: "Sort order",
								type: "number",
								value: String(form.sort_order),
								onChange: (v) => setForm({
									...form,
									sort_order: Number(v)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								label: "Description",
								value: form.description,
								onChange: (v) => setForm({
									...form,
									description: v
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: create,
						className: "mt-5 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
						children: "Create category"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[560px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Slug"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Sort"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-4" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "p-8 text-center text-zinc-500",
						children: "Loading…"
					}) }) : (data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-white/5 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-100",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 font-mono text-xs text-zinc-400",
								children: c.slug
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-400",
								children: c.sort_order
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toggle(c.id, c.is_active),
									className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.is_active ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-zinc-700/40 text-zinc-400"}`,
									children: c.is_active ? "Active" : "Hidden"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => del(c.id),
									className: "text-red-400 hover:text-red-300",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							})
						]
					}, c.id)) })]
				})
			})
		]
	});
}
function slugify(s) {
	return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function Input({ label, value, onChange, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-widest text-zinc-500",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
		})]
	});
}
function Select({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-widest text-zinc-500",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40",
			children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: o,
				children: o
			}, o))
		})]
	});
}
//#endregion
export { CategoriesAdmin as component };
