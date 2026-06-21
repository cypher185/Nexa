import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as Plus, m as RefreshCw, n as X, r as Wifi, s as Trash2 } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.smm-providers-B6mGnh8y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function authedFetch(path, body) {
	const { data: { session } } = await supabase.auth.getSession();
	const res = await fetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
		},
		body: JSON.stringify(body)
	});
	const json = await res.json().catch(() => ({}));
	return {
		ok: res.ok,
		status: res.status,
		json
	};
}
function SmmProvidersAdmin() {
	const qc = useQueryClient();
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		api_url: "",
		api_key: ""
	});
	const [syncing, setSyncing] = (0, import_react.useState)(null);
	const [testing, setTesting] = (0, import_react.useState)(false);
	const { data } = useQuery({
		queryKey: ["admin", "smm-providers"],
		queryFn: async () => {
			const { data } = await supabase.from("smm_providers").select("*").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const create = async () => {
		if (!form.name || !form.api_url || !form.api_key) return toast.error("All fields required");
		const { error } = await supabase.from("smm_providers").insert(form);
		if (error) return toast.error(error.message);
		toast.success("Provider added");
		setAdding(false);
		setForm({
			name: "",
			api_url: "",
			api_key: ""
		});
		qc.invalidateQueries({ queryKey: ["admin", "smm-providers"] });
	};
	const test = async () => {
		if (!form.api_url || !form.api_key) return toast.error("URL & key required");
		setTesting(true);
		const r = await authedFetch("/api/smm/admin/test", {
			api_url: form.api_url,
			api_key: form.api_key
		});
		setTesting(false);
		if (!r.ok) return toast.error(r.json.error ?? "Test failed");
		const bal = r.json.balance ? `${r.json.balance.balance} ${r.json.balance.currency}` : "unknown";
		toast.success(`Connected — balance ${bal} · ${r.json.services_count ?? 0} services across ${r.json.categories_count ?? 0} categories`);
	};
	const toggle = async (id, enabled) => {
		await supabase.from("smm_providers").update({ enabled: !enabled }).eq("id", id);
		qc.invalidateQueries({ queryKey: ["admin", "smm-providers"] });
	};
	const del = async (id) => {
		if (!confirm("Delete this provider and all its services?")) return;
		const { error } = await supabase.from("smm_providers").delete().eq("id", id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["admin", "smm-providers"] });
	};
	const sync = async (id) => {
		setSyncing(id);
		const r = await authedFetch("/api/smm/admin/sync", { provider_id: id });
		setSyncing(null);
		if (!r.ok) return toast.error(r.json.error ?? "Sync failed");
		toast.success(`Synced ${r.json.services_synced} services`);
		qc.invalidateQueries({ queryKey: ["admin", "smm-providers"] });
		qc.invalidateQueries({ queryKey: ["admin", "smm-services"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-zinc-500",
						children: "SMM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white",
						children: "SMM Providers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 max-w-2xl text-xs text-zinc-500",
						children: [
							"Add upstream SMM panels (JustAnotherPanel, Peakerr, etc.). After adding, click ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sync" }),
							" to pull their services."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setAdding(true),
					className: "inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add provider"]
				})]
			}),
			adding && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-2xl bg-vault-surface p-4 sm:p-6 ring-1 ring-vault-gold/20",
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
									name: v
								}),
								placeholder: "e.g. Peakerr"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "API URL",
								value: form.api_url,
								onChange: (v) => setForm({
									...form,
									api_url: v
								}),
								placeholder: "https://peakerr.com/api/v2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "API key",
								value: form.api_key,
								onChange: (v) => setForm({
									...form,
									api_key: v
								}),
								className: "md:col-span-2"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: test,
							disabled: testing,
							className: "inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-3.5" }),
								" ",
								testing ? "Testing…" : "Test connection"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: create,
							className: "rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
							children: "Save provider"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "URL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Balance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-center",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Last sync"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "p-8 text-center text-zinc-500",
						children: "No providers yet."
					}) }) : data?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-white/5 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-white",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-xs text-zinc-400 truncate max-w-xs",
								children: p.api_url
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right tabular-nums text-zinc-200",
								children: p.balance_usd != null ? `${p.balance_usd} ${p.currency}` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => toggle(p.id, p.enabled),
									className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`,
									children: p.enabled ? "Active" : "Disabled"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-[11px] text-zinc-500",
								children: p.last_synced_at ? new Date(p.last_synced_at).toLocaleString() : "Never"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => sync(p.id),
										disabled: syncing === p.id,
										className: "inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3 ${syncing === p.id ? "animate-spin" : ""}` }), " Sync"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => del(p.id),
										className: "text-red-400 hover:text-red-300",
										"aria-label": "Delete provider",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								})
							})
						]
					}, p.id)) })]
				})
			})
		]
	});
}
function Field({ label, value, onChange, placeholder, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-widest text-zinc-500",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
		})]
	});
}
//#endregion
export { SmmProvidersAdmin as component };
