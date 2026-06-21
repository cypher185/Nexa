import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./use-auth-7T2UG58p.mjs";
import { b as useParams, g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-chrome-Bb2gtJDG.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account._id-DPVDSEr3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountDetail() {
	const { id } = useParams({ from: "/account/$id" });
	const { user } = useAuth();
	const navigate = useNavigate();
	const [buying, setBuying] = (0, import_react.useState)(false);
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["product", id],
		queryFn: async () => {
			const { data: p } = await supabase.from("products").select("*, categories(name, slug, accent)").eq("id", id).maybeSingle();
			if (!p) return null;
			const { data: counts } = await supabase.rpc("get_available_stock", { _product_ids: [id] });
			const stock = counts?.[0]?.available_count ?? 0;
			return {
				...p,
				stock: Number(stock)
			};
		}
	});
	const handleBuy = async () => {
		if (!user) {
			toast.error("Please sign in first");
			navigate({
				to: "/auth",
				search: {
					mode: "signin",
					redirect: `/account/${id}`
				}
			});
			return;
		}
		setBuying(true);
		const { data: result, error } = await supabase.rpc("purchase_account", { _product_id: id });
		setBuying(false);
		if (error) {
			const msg = error.message || "";
			if (msg.includes("INSUFFICIENT_BALANCE")) toast.error("Insufficient wallet balance", {
				description: "Fund your wallet to complete this purchase.",
				action: {
					label: "Fund wallet",
					onClick: () => navigate({ to: "/fund" })
				}
			});
			else if (msg.includes("OUT_OF_STOCK")) {
				toast.error("Out of stock", { description: "This product just sold out. Refresh for updates." });
				refetch();
			} else toast.error("Purchase failed", { description: msg });
			return;
		}
		toast.success("Purchase successful!", { description: "Credentials are now in your dashboard." });
		navigate({ to: "/purchases" });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-4xl px-6 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-96 animate-pulse rounded-2xl bg-vault-surface" })
		})]
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-6 py-24 text-center text-zinc-400",
			children: [
				"Listing not found.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/browse",
					className: "text-vault-gold-light",
					children: "Back to marketplace"
				})
			]
		})]
	});
	const metadata = data.metadata || {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-4xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/category/$slug",
					params: { slug: data.categories?.slug ?? "" },
					className: "mb-6 inline-block text-xs text-zinc-500 hover:text-vault-gold-light",
					children: ["← Back to ", data.categories?.name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 md:grid-cols-[1fr_320px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl bg-vault-surface p-8 ring-1 ring-white/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] uppercase tracking-widest text-zinc-500",
								children: data.categories?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-sora text-3xl font-semibold text-white",
								children: data.title
							}),
							data.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-relaxed text-zinc-400",
								children: data.description
							}),
							Object.keys(metadata).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 space-y-3 border-t border-white/5 pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-sora text-sm font-medium text-zinc-300",
									children: "Account details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "grid grid-cols-2 gap-x-6 gap-y-3 text-xs",
									children: Object.entries(metadata).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between border-b border-white/5 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-zinc-500 capitalize",
											children: k.replace(/_/g, " ")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-zinc-200",
											children: String(v)
										})]
									}, k))
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "h-fit rounded-3xl bg-vault-surface p-6 ring-1 ring-white/5 md:sticky md:top-24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-widest text-zinc-500",
								children: "Price"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-sora text-3xl font-semibold text-white",
								children: formatNaira(data.price_kobo)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block size-2 rounded-full ${data.stock > 0 ? "bg-emerald-400" : "bg-zinc-600"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-zinc-400",
									children: data.stock > 0 ? `${data.stock} available` : "Out of stock"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: buying || data.stock === 0,
								onClick: handleBuy,
								className: "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-vault-gold px-4 py-3 text-sm font-semibold text-vault-bg transition hover:bg-vault-gold-light disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500",
								children: [buying && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), data.stock === 0 ? "Out of stock" : buying ? "Processing…" : "Purchase with wallet"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-[11px] text-zinc-500",
								children: "Credentials revealed instantly in your dashboard."
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { AccountDetail as component };
