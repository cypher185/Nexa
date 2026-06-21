import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { S as Layers, _ as Package, h as Plus, n as X, s as Trash2 } from "../_libs/lucide-react.mjs";
import { r as nairaToKobo, t as formatNaira } from "./format-DrTbiGi6.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-BZbunRsE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductsAdmin() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [stockFor, setStockFor] = (0, import_react.useState)(null);
	const { data } = useQuery({
		queryKey: ["admin", "products"],
		queryFn: async () => {
			const { data: cats } = await supabase.from("categories").select("id, name").order("name");
			const { data: prods } = await supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });
			const counts = {};
			if (prods && prods.length > 0) {
				const ids = prods.map((p) => p.id);
				const { data: stockRows } = await supabase.from("account_stock").select("product_id, status").in("product_id", ids);
				(stockRows ?? []).forEach((s) => {
					if (s.status === "available") counts[s.product_id] = (counts[s.product_id] ?? 0) + 1;
				});
			}
			return {
				cats: cats ?? [],
				prods: prods ?? [],
				counts
			};
		}
	});
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
					children: "Products"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setAdding(true),
					className: "inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New product"]
				})]
			}),
			adding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
				categories: data?.cats ?? [],
				onClose: () => setAdding(false),
				onSaved: () => {
					qc.invalidateQueries({ queryKey: ["admin", "products"] });
					setAdding(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[600px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Title"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-4" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data?.prods ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "p-8 text-center text-zinc-500",
						children: "No products yet."
					}) }) : data?.prods.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-white/5 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-100",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-400",
								children: p.categories?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right font-medium text-white",
								children: formatNaira(p.price_kobo)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${(data.counts[p.id] ?? 0) === 0 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`,
									children: [data.counts[p.id] ?? 0, " avail"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-4 text-right space-x-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setStockFor(p.id),
									className: "text-vault-gold-light hover:underline text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "inline size-3.5" }), " stock"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: async () => {
										if (!confirm("Delete this product? All unsold stock will be removed too.")) return;
										const { error } = await supabase.from("products").delete().eq("id", p.id);
										if (error) return toast.error(error.message);
										qc.invalidateQueries({ queryKey: ["admin", "products"] });
									},
									className: "text-red-400 hover:text-red-300",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							})
						]
					}, p.id)) })]
				})
			}),
			stockFor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockManager, {
				productId: stockFor,
				onClose: () => {
					setStockFor(null);
					qc.invalidateQueries({ queryKey: ["admin", "products"] });
				}
			})
		]
	});
}
function ProductForm({ categories, onClose, onSaved }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [priceNaira, setPriceNaira] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)(categories[0]?.id ?? "");
	const [metadataText, setMetadataText] = (0, import_react.useState)("{\n  \"age\": \"2018\",\n  \"location\": \"Nigeria\"\n}");
	const save = async () => {
		if (!title || !priceNaira || !categoryId) return toast.error("Fill all required fields");
		let metadata = {};
		try {
			metadata = JSON.parse(metadataText);
		} catch {
			return toast.error("Metadata is not valid JSON");
		}
		const { error } = await supabase.from("products").insert({
			title,
			description,
			price_kobo: nairaToKobo(priceNaira),
			category_id: categoryId,
			metadata,
			source: "internal"
		});
		if (error) return toast.error(error.message);
		toast.success("Product created");
		onSaved();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "absolute right-4 top-4 text-zinc-500 hover:text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40",
							value: title,
							onChange: (e) => setTitle(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-widest text-zinc-500",
						children: "Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40",
						value: categoryId,
						onChange: (e) => setCategoryId(e.target.value),
						children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-widest text-zinc-500",
						children: "Price (₦)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40",
						value: priceNaira,
						onChange: (e) => setPriceNaira(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40",
							value: description,
							onChange: (e) => setDescription(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "Metadata (JSON — shown on product page)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 6,
							className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 font-mono text-xs text-white outline-none focus:border-vault-gold/40",
							value: metadataText,
							onChange: (e) => setMetadataText(e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: save,
				className: "mt-5 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
				children: "Save product"
			})
		]
	});
}
function StockManager({ productId, onClose }) {
	const qc = useQueryClient();
	const [bulk, setBulk] = (0, import_react.useState)("");
	const { data } = useQuery({
		queryKey: [
			"admin",
			"stock",
			productId
		],
		queryFn: async () => {
			const { data } = await supabase.from("account_stock").select("id, status, credentials, sold_at, created_at").eq("product_id", productId).order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	const addBulk = async () => {
		const lines = bulk.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
		if (lines.length === 0) return toast.error("Paste at least one line");
		const rows = lines.map((credentials) => ({
			product_id: productId,
			credentials
		}));
		const { error } = await supabase.from("account_stock").insert(rows);
		if (error) return toast.error(error.message);
		toast.success(`${lines.length} account(s) added to stock`);
		setBulk("");
		qc.invalidateQueries({ queryKey: [
			"admin",
			"stock",
			productId
		] });
	};
	const removeStock = async (id) => {
		if (!confirm("Remove this stock item?")) return;
		await supabase.from("account_stock").delete().eq("id", id);
		qc.invalidateQueries({ queryKey: [
			"admin",
			"stock",
			productId
		] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/70 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-3xl max-h-[85vh] overflow-auto rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-sora text-lg font-semibold text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "inline size-4 mr-1" }), " Stock manager"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "text-zinc-400 hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "Bulk add — one credential per line (e.g. email:password:recovery)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 5,
							value: bulk,
							onChange: (e) => setBulk(e.target.value),
							placeholder: "user1@gmail.com:Pass1234:recovery1@x.com\nuser2@gmail.com:Pass5678:recovery2@x.com",
							className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 font-mono text-xs text-white outline-none focus:border-vault-gold/40"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addBulk,
							className: "mt-3 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
							children: "Add to stock"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "font-sora text-sm font-medium text-zinc-300",
						children: [
							"Existing stock (",
							data?.length ?? 0,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 max-h-80 overflow-auto rounded-xl ring-1 ring-white/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
							className: "w-full text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-6 text-center text-zinc-500",
								children: "No stock yet."
							}) }) : data?.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-white/5 last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.status === "available" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"}`,
											children: s.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-3 font-mono text-zinc-400 line-clamp-1 max-w-md",
										children: [s.credentials.slice(0, 60), s.credentials.length > 60 ? "…" : ""]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-right",
										children: s.status !== "sold" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeStock(s.id),
											className: "text-red-400 hover:text-red-300",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
										})
									})
								]
							}, s.id)) })
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { ProductsAdmin as component };
