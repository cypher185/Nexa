import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./use-auth-7T2UG58p.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as ArrowLeft, b as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-chrome-Bb2gtJDG.mjs";
import { r as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./smm._serviceId-BzhvAx7d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smm._serviceId-CjplWbGp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_NGN_PER_USD = 1600;
function SmmServiceDetail() {
	const { serviceId } = Route.useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [link, setLink] = (0, import_react.useState)("");
	const [qty, setQty] = (0, import_react.useState)("");
	const [placing, setPlacing] = (0, import_react.useState)(false);
	const { data: rate } = useQuery({
		queryKey: ["smm-rate"],
		queryFn: async () => {
			const { data } = await supabase.from("site_settings").select("value").eq("key", "smm_ngn_per_usd").maybeSingle();
			return Number((data?.value)?.value) || DEFAULT_NGN_PER_USD;
		}
	});
	const { data: svc, isLoading } = useQuery({
		queryKey: ["smm-service", serviceId],
		queryFn: async () => (await supabase.from("smm_services").select("*, smm_categories(name)").eq("id", serviceId).maybeSingle()).data
	});
	const ngnPerUsd = rate ?? DEFAULT_NGN_PER_USD;
	const qtyNum = parseInt(qty, 10) || 0;
	const price = (0, import_react.useMemo)(() => {
		if (!svc || !qtyNum) return 0;
		return Math.ceil(Number(svc.rate_usd_per_1000) * qtyNum * ngnPerUsd / 1e3 * (1 + Number(svc.markup_pct) / 100));
	}, [
		svc,
		qtyNum,
		ngnPerUsd
	]);
	const submit = async () => {
		if (!user) {
			navigate({
				to: "/auth",
				search: {
					mode: "signin",
					redirect: `/smm/${serviceId}`
				}
			});
			return;
		}
		if (!svc) return;
		if (!link.trim()) return toast.error("Enter the target link");
		if (qtyNum < svc.min_qty || qtyNum > svc.max_qty) return toast.error(`Quantity must be between ${svc.min_qty} and ${svc.max_qty}`);
		setPlacing(true);
		const { data: { session } } = await supabase.auth.getSession();
		const res = await fetch("/api/smm/place-order", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
			},
			body: JSON.stringify({
				service_id: svc.id,
				link: link.trim(),
				quantity: qtyNum
			})
		});
		setPlacing(false);
		const json = await res.json().catch(() => ({}));
		if (!res.ok) {
			if (json.error === "INSUFFICIENT_BALANCE") {
				toast.error("Not enough wallet balance");
				navigate({ to: "/fund" });
				return;
			}
			return toast.error(json.error ?? "Order failed");
		}
		toast.success("Order placed!");
		navigate({ to: "/smm-orders" });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-[60vh] place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-vault-gold" })
		})]
	});
	if (!svc) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl px-4 py-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-zinc-400",
				children: "Service not found."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/smm",
				className: "mt-4 inline-flex items-center gap-2 text-vault-gold-light",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to catalog"]
			})]
		})]
	});
	const ngnPer1k = Math.ceil(Number(svc.rate_usd_per_1000) * ngnPerUsd * (1 + Number(svc.markup_pct) / 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-4 py-10 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/smm",
					className: "inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-vault-gold-light",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3" }), " All SMM services"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: svc.smm_categories?.name ?? svc.provider_category ?? "Service"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-sora text-xl sm:text-2xl font-semibold text-white",
							children: svc.name
						}),
						svc.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-zinc-400 whitespace-pre-line",
							children: svc.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Per 1,000",
									value: formatNaira(ngnPer1k * 100),
									accent: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Min order",
									value: svc.min_qty.toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Max order",
									value: svc.max_qty.toLocaleString()
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-widest text-zinc-500",
										children: "Target link / username"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: link,
										onChange: (e) => setLink(e.target.value),
										placeholder: "https://instagram.com/yourprofile",
										className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-widest text-zinc-500",
										children: "Quantity"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: svc.min_qty,
										max: svc.max_qty,
										value: qty,
										onChange: (e) => setQty(e.target.value),
										placeholder: `min ${svc.min_qty}`,
										className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg border border-vault-gold/20 bg-vault-gold/5 px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-widest text-zinc-400",
										children: "Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-sora text-xl text-vault-gold-light",
										children: formatNaira(price)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: submit,
									disabled: placing || !qtyNum || !link,
									className: "w-full rounded-lg bg-vault-gold px-4 py-3 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light disabled:opacity-50",
									children: placing ? "Placing order…" : user ? "Place order" : "Sign in to order"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-[10px] text-zinc-500",
									children: "Charged from your NexaLogs wallet. Refunds are issued automatically for canceled or partial orders."
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Stat({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-vault-bg/60 p-3 ring-1 ring-white/5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-widest text-zinc-500",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 font-sora text-base ${accent ? "text-vault-gold-light" : "text-white"}`,
			children: value
		})]
	});
}
//#endregion
export { SmmServiceDetail as component };
