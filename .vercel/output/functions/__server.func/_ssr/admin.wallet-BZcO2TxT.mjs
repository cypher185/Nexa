import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { s as Trash2 } from "../_libs/lucide-react.mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.wallet-BZcO2TxT.js
var import_jsx_runtime = require_jsx_runtime();
function TransactionsAdmin() {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["admin", "transactions"],
		queryFn: async () => {
			const { data: txs } = await supabase.from("wallet_transactions").select("*").order("created_at", { ascending: false }).limit(300);
			const list = txs ?? [];
			if (list.length === 0) return [];
			const ids = Array.from(new Set(list.map((t) => t.user_id)));
			const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", ids);
			const emailMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.email]));
			return list.map((t) => ({
				...t,
				user_email: emailMap[t.user_id] ?? "—"
			}));
		}
	});
	const deleteOne = async (id) => {
		if (!confirm("Delete this transaction log? This cannot be undone.")) return;
		const { error } = await supabase.from("wallet_transactions").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Log deleted");
		qc.invalidateQueries({ queryKey: ["admin", "transactions"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-widest text-zinc-500",
			children: "Finance"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white",
			children: "Wallet transactions"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-4",
							children: "User"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-4",
							children: "Type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-4",
							children: "Description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-4 text-right",
							children: "Amount"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-4 text-right",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-4 text-right",
							children: "When"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-4" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 7,
					className: "p-8 text-center text-zinc-500",
					children: "No transactions."
				}) }) : data?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-white/5 last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 text-zinc-300",
							children: t.user_email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 capitalize text-zinc-200",
							children: t.type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 text-zinc-400 line-clamp-1 max-w-xs",
							children: t.description ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: `p-4 text-right font-medium tabular-nums ${t.amount_kobo >= 0 ? "text-emerald-400" : "text-zinc-100"}`,
							children: [t.amount_kobo >= 0 ? "+" : "−", formatNaira(Math.abs(t.amount_kobo))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${t.status === "success" ? "bg-emerald-500/10 text-emerald-400" : t.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`,
								children: t.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 text-right text-[11px] text-zinc-500",
							children: new Date(t.created_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => deleteOne(t.id),
								className: "text-red-400 hover:text-red-300",
								"aria-label": "Delete log",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})
						})
					]
				}, t.id)) })]
			})
		})]
	});
}
//#endregion
export { TransactionsAdmin as component };
