import { i as __toESM } from "./_runtime.mjs";
import { n as supabase } from "./_ssr/client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, t as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/use-auth-7T2UG58p.mjs";
import { D as EyeOff, E as Eye, N as Check, k as Copy } from "./_libs/lucide-react.mjs";
import { t as formatNaira } from "./_ssr/format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./_ssr/site-chrome-Bb2gtJDG.mjs";
import { r as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated.purchases-DcVhmibn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PurchasesPage() {
	const { user } = useAuth();
	const { data, isLoading } = useQuery({
		queryKey: ["purchases", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data } = await supabase.from("orders").select("id, price_kobo, status, created_at, stock_id, products(title, categories(name))").eq("user_id", user.id).eq("status", "fulfilled").order("created_at", { ascending: false });
			if (!data) return [];
			const stockIds = data.map((o) => o.stock_id).filter(Boolean);
			let stocks = {};
			if (stockIds.length > 0) {
				const { data: s } = await supabase.from("account_stock").select("id, credentials").in("id", stockIds);
				stocks = Object.fromEntries((s ?? []).map((x) => [x.id, { credentials: x.credentials }]));
			}
			return data.map((o) => ({
				...o,
				credentials: stocks[o.stock_id ?? ""]?.credentials ?? null
			}));
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-5xl px-6 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-zinc-500",
						children: "My accounts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-sora text-3xl font-semibold text-white",
						children: "Purchased accounts"
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-2xl bg-vault-surface" }, i))
				}) : (data?.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-500",
					children: "You haven't purchased any accounts yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: data?.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PurchaseCard, { order: o }, o.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function PurchaseCard({ order }) {
	const [shown, setShown] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const copy = () => {
		if (!order.credentials) return;
		navigator.clipboard.writeText(order.credentials);
		setCopied(true);
		toast.success("Credentials copied");
		setTimeout(() => setCopied(false), 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-widest text-zinc-500",
					children: order.products?.categories?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-sora text-base font-medium text-white",
					children: order.products?.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[11px] text-zinc-500",
					children: [
						"Purchased ",
						new Date(order.created_at).toLocaleString(),
						" · ",
						formatNaira(order.price_kobo)
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShown((v) => !v),
					className: "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/10",
					children: [shown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), shown ? "Hide" : "Reveal"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: copy,
					className: "inline-flex items-center gap-1.5 rounded-lg bg-vault-gold px-3 py-1.5 text-xs font-semibold text-vault-bg hover:bg-vault-gold-light",
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy"]
				})]
			})]
		}), shown && order.credentials && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "mt-4 max-h-64 overflow-auto rounded-xl bg-vault-bg p-4 font-mono text-xs leading-relaxed text-vault-gold-light ring-1 ring-vault-gold/10",
			children: order.credentials
		})]
	});
}
//#endregion
export { PurchasesPage as component };
