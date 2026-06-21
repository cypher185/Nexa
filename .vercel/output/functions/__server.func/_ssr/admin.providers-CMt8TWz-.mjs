import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as Plus, n as X, s as Trash2 } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.providers-CMt8TWz-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProvidersAdmin() {
	const qc = useQueryClient();
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		slug: "",
		base_url: "",
		api_key_secret_name: "",
		config: "{}"
	});
	const { data } = useQuery({
		queryKey: ["admin", "providers"],
		queryFn: async () => {
			const { data } = await supabase.from("external_providers").select("*").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const create = async () => {
		if (!form.name || !form.slug) return toast.error("Name and slug required");
		let config = {};
		try {
			config = JSON.parse(form.config);
		} catch {
			return toast.error("Config must be valid JSON");
		}
		const { error } = await supabase.from("external_providers").insert({
			name: form.name,
			slug: form.slug,
			base_url: form.base_url || null,
			api_key_secret_name: form.api_key_secret_name || null,
			config
		});
		if (error) return toast.error(error.message);
		toast.success("Provider added");
		setAdding(false);
		setForm({
			name: "",
			slug: "",
			base_url: "",
			api_key_secret_name: "",
			config: "{}"
		});
		qc.invalidateQueries({ queryKey: ["admin", "providers"] });
	};
	const toggle = async (id, is_active) => {
		await supabase.from("external_providers").update({ is_active: !is_active }).eq("id", id);
		qc.invalidateQueries({ queryKey: ["admin", "providers"] });
	};
	const del = async (id) => {
		if (!confirm("Delete this provider?")) return;
		const { error } = await supabase.from("external_providers").delete().eq("id", id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["admin", "providers"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-zinc-500",
						children: "Integrations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-sora text-3xl font-semibold text-white",
						children: "External providers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 max-w-2xl text-xs text-zinc-500",
						children: [
							"Plug in any reseller API. Store the API key as an env-secret on your server and reference its name here. Sync runs at ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-vault-gold-light",
								children: "/api/public/providers/sync"
							}),
							"."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setAdding(true),
					className: "inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add provider"]
				})]
			}),
			adding && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setAdding(false),
						className: "absolute right-4 top-4 text-zinc-500 hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Name",
								value: form.name,
								onChange: (v) => setForm({
									...form,
									name: v,
									slug: form.slug || v.toLowerCase().replace(/[^a-z0-9]+/g, "-")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Slug",
								value: form.slug,
								onChange: (v) => setForm({
									...form,
									slug: v
								}),
								helper: "URL-safe identifier (e.g. peakerr, smmstone)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Base URL",
								value: form.base_url,
								onChange: (v) => setForm({
									...form,
									base_url: v
								}),
								placeholder: "https://peakerr.com/api/v2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "API key secret name (env var)",
								value: form.api_key_secret_name,
								onChange: (v) => setForm({
									...form,
									api_key_secret_name: v
								}),
								placeholder: "PROVIDER_API_KEY"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "md:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-widest text-zinc-500",
										children: "Config (JSON)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-zinc-500 mb-1",
										children: [
											"Extra settings for this provider. Leave as ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { className: "text-vault-gold-light" }),
											" if not needed."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 4,
										className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 font-mono text-xs text-white outline-none focus:border-vault-gold/40",
										value: form.config,
										onChange: (e) => setForm({
											...form,
											config: e.target.value
										})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: create,
						className: "mt-5 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
						children: "Add provider"
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
								children: "Base URL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Secret"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-4" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "p-8 text-center text-zinc-500",
						children: "No providers yet."
					}) }) : data?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-white/5 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-100",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 font-mono text-xs text-zinc-400",
								children: p.slug
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 font-mono text-xs text-zinc-400 max-w-xs line-clamp-1",
								children: p.base_url ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 font-mono text-xs text-vault-gold-light",
								children: p.api_key_secret_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toggle(p.id, p.is_active),
									className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"}`,
									children: p.is_active ? "Active" : "Off"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => del(p.id),
									className: "text-red-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							})
						]
					}, p.id)) })]
				})
			})
		]
	});
}
function Field({ label, value, onChange, placeholder, helper }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase tracking-widest text-zinc-500",
				children: label
			}),
			helper && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-zinc-500",
				children: helper
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value,
				placeholder,
				onChange: (e) => onChange(e.target.value),
				className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
			})
		]
	});
}
//#endregion
export { ProvidersAdmin as component };
