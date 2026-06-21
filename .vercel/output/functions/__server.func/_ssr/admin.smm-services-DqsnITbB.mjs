import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { C as Image, p as Search } from "../_libs/lucide-react.mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.smm-services-DqsnITbB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_NGN_PER_USD = 1600;
function SmmServicesAdmin() {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [providerFilter, setProviderFilter] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("");
	const [editingCats, setEditingCats] = (0, import_react.useState)(false);
	const { data: providers } = useQuery({
		queryKey: ["admin", "smm-providers-min"],
		queryFn: async () => (await supabase.from("smm_providers").select("id, name")).data ?? []
	});
	const { data: categories } = useQuery({
		queryKey: ["admin", "smm-categories"],
		queryFn: async () => (await supabase.from("smm_categories").select("*").order("sort_order").order("name")).data ?? []
	});
	const { data: rateData } = useQuery({
		queryKey: ["admin", "smm-rate"],
		queryFn: async () => {
			const { data } = await supabase.from("site_settings").select("value").eq("key", "smm_ngn_per_usd").maybeSingle();
			return Number((data?.value)?.value) || DEFAULT_NGN_PER_USD;
		}
	});
	const ngnPerUsd = rateData ?? DEFAULT_NGN_PER_USD;
	const [rateInput, setRateInput] = (0, import_react.useState)("");
	const { data: defaultMarkup } = useQuery({
		queryKey: ["admin", "smm-default-markup"],
		queryFn: async () => {
			const { data } = await supabase.from("site_settings").select("value").eq("key", "smm_default_markup_pct").maybeSingle();
			const n = Number((data?.value)?.value);
			return Number.isFinite(n) ? n : 30;
		}
	});
	const [markupInput, setMarkupInput] = (0, import_react.useState)("");
	const { data: services } = useQuery({
		queryKey: ["admin", "smm-services"],
		queryFn: async () => (await supabase.from("smm_services").select("*, smm_providers(name), smm_categories(name, logo_url)").order("name").limit(2e3)).data ?? []
	});
	const filtered = (0, import_react.useMemo)(() => {
		return (services ?? []).filter((s) => {
			if (providerFilter && s.provider_id !== providerFilter) return false;
			if (categoryFilter && s.category_id !== categoryFilter) return false;
			if (q) {
				if (!`${s.name} ${s.provider_category ?? ""} ${s.type ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
			}
			return true;
		});
	}, [
		services,
		q,
		providerFilter,
		categoryFilter
	]);
	const saveRate = async () => {
		const n = Number(rateInput);
		if (!Number.isFinite(n) || n <= 0) return toast.error("Enter a positive number");
		const { error } = await supabase.from("site_settings").upsert({
			key: "smm_ngn_per_usd",
			value: { value: n },
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (error) return toast.error(error.message);
		toast.success(`FX saved: ₦${n} / $1`);
		qc.invalidateQueries({ queryKey: ["admin", "smm-rate"] });
	};
	const saveDefaultMarkup = async () => {
		const n = Number(markupInput);
		if (!Number.isFinite(n) || n < 0) return toast.error("Enter a non-negative number");
		const { error } = await supabase.from("site_settings").upsert({
			key: "smm_default_markup_pct",
			value: { value: n },
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (error) return toast.error(error.message);
		toast.success(`Default markup saved: ${n}% (applies to newly-synced services)`);
		qc.invalidateQueries({ queryKey: ["admin", "smm-default-markup"] });
	};
	const applyMarkupToAll = async () => {
		const n = Number(markupInput || defaultMarkup);
		if (!Number.isFinite(n) || n < 0) return toast.error("Enter a number");
		if (!confirm(`Set markup to ${n}% on ALL services? This overrides per-service overrides.`)) return;
		const { data, error } = await supabase.rpc("admin_apply_smm_markup", { _pct: n });
		if (error) return toast.error(error.message);
		toast.success(`Applied ${n}% to ${data ?? 0} services`);
		qc.invalidateQueries({ queryKey: ["admin", "smm-services"] });
	};
	const update = async (id, patch) => {
		const { error } = await supabase.from("smm_services").update(patch).eq("id", id);
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["admin", "smm-services"] });
	};
	const addCategory = async () => {
		const name = prompt("Category name (e.g. Instagram)");
		if (!name) return;
		const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
		const { error } = await supabase.from("smm_categories").insert({
			name,
			slug
		});
		if (error) return toast.error(error.message);
		qc.invalidateQueries({ queryKey: ["admin", "smm-categories"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-zinc-500",
					children: "SMM"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white",
					children: "SMM Services"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-xs text-zinc-500",
					children: "User price = USD rate × NGN/USD × (1 + markup%). Default markup applies to all newly-synced services; per-service overrides are preserved."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "FX rate (₦ per $1)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-sora text-xl text-white",
							children: ["₦", ngnPerUsd.toLocaleString()]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								step: 1,
								placeholder: String(ngnPerUsd),
								value: rateInput,
								onChange: (e) => setRateInput(e.target.value),
								className: "w-32 rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: saveRate,
								className: "rounded-lg bg-vault-gold px-3 py-2 text-xs font-semibold text-vault-bg hover:bg-vault-gold-light",
								children: "Save"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "Default markup %"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-sora text-xl text-white",
							children: [defaultMarkup ?? 30, "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									step: 1,
									placeholder: String(defaultMarkup ?? 30),
									value: markupInput,
									onChange: (e) => setMarkupInput(e.target.value),
									className: "w-24 rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: saveDefaultMarkup,
									className: "rounded-lg bg-vault-gold px-3 py-2 text-xs font-semibold text-vault-bg hover:bg-vault-gold-light",
									children: "Save default"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: applyMarkupToAll,
									className: "rounded-lg border border-vault-gold/30 px-3 py-2 text-xs text-vault-gold-light hover:bg-vault-gold/10",
									children: "Apply to all"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-zinc-500",
						children: "Categories & logos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-400",
						children: "Set an official logo URL for each category — shown on the storefront."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditingCats((v) => !v),
							className: "rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5",
							children: editingCats ? "Done" : "Edit logos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addCategory,
							className: "rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5",
							children: "+ Add"
						})]
					})]
				}), editingCats && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-2",
					children: (categories ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryRow, {
						cat: c,
						onSaved: () => qc.invalidateQueries({ queryKey: ["admin", "smm-categories"] })
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-3.5 text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search services",
							className: "w-60 rounded-lg border border-white/10 bg-vault-surface pl-9 pr-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: providerFilter,
						onChange: (e) => setProviderFilter(e.target.value),
						className: "rounded-lg border border-white/10 bg-vault-surface px-3 py-2 text-sm text-white outline-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All providers"
						}), providers?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: categoryFilter,
						onChange: (e) => setCategoryFilter(e.target.value),
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[920px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Service"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Provider"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Rate (USD/1k)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Markup %"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "User ₦/1k"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Min"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Max"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-center",
								children: "Visible"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 9,
						className: "p-8 text-center text-zinc-500",
						children: "No services. Sync a provider first."
					}) }) : filtered.map((s) => {
						const ngnPer1k = Math.ceil(Number(s.rate_usd_per_1000) * ngnPerUsd * (1 + Number(s.markup_pct) / 100));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-white/5 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-zinc-100",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [s.smm_categories?.logo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: s.smm_categories.logo_url,
											alt: "",
											className: "size-5 rounded object-contain"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: s.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] text-zinc-500",
											children: [
												s.provider_category,
												" ",
												s.type ? `· ${s.type}` : ""
											]
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-xs text-zinc-400",
									children: s.smm_providers?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: s.category_id ?? "",
										onChange: (e) => update(s.id, { category_id: e.target.value || null }),
										className: "rounded border border-white/10 bg-vault-bg px-2 py-1 text-xs text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "—"
										}), categories?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.id,
											children: c.name
										}, c.id))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "p-3 text-right tabular-nums text-zinc-400",
									children: ["$", Number(s.rate_usd_per_1000).toFixed(4)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 0,
										step: 1,
										defaultValue: s.markup_pct,
										onBlur: (e) => {
											const v = Number(e.target.value);
											if (Number.isFinite(v) && v !== Number(s.markup_pct)) update(s.id, { markup_pct: v });
										},
										className: "w-16 rounded border border-white/10 bg-vault-bg px-2 py-1 text-right text-xs text-white"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right tabular-nums text-vault-gold-light",
									children: formatNaira(ngnPer1k * 100)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right text-xs text-zinc-400",
									children: s.min_qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right text-xs text-zinc-400",
									children: s.max_qty.toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => update(s.id, {
											visible: !s.visible,
											enabled: !s.visible
										}),
										className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.visible && s.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`,
										children: s.visible && s.enabled ? "Visible" : "Hidden"
									})
								})
							]
						}, s.id);
					}) })]
				})
			})
		]
	});
}
function CategoryRow({ cat, onSaved }) {
	const [logo, setLogo] = (0, import_react.useState)(cat.logo_url ?? "");
	const save = async () => {
		const { error } = await supabase.from("smm_categories").update({ logo_url: logo || null }).eq("id", cat.id);
		if (error) return toast.error(error.message);
		toast.success(`Saved logo for ${cat.name}`);
		onSaved();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-lg border border-white/5 bg-vault-bg/40 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-10 shrink-0 place-items-center rounded-lg bg-vault-bg ring-1 ring-white/10",
				children: logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: logo,
					alt: "",
					className: "size-8 object-contain"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4 text-zinc-600" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm text-white",
					children: cat.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: logo,
					onChange: (e) => setLogo(e.target.value),
					placeholder: "https://… logo URL",
					className: "mt-1 w-full rounded border border-white/10 bg-vault-bg px-2 py-1 text-xs text-zinc-200 outline-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: save,
				className: "rounded bg-vault-gold px-2 py-1 text-[11px] font-semibold text-vault-bg",
				children: "Save"
			})
		]
	});
}
//#endregion
export { SmmServicesAdmin as component };
