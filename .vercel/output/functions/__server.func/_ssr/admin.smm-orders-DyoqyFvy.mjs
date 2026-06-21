import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { m as RefreshCw, s as Trash2 } from "../_libs/lucide-react.mjs";
import { t as formatNaira } from "./format-DrTbiGi6.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.smm-orders-DyoqyFvy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function authedFetch(path, body) {
	const { data: { session } } = await supabase.auth.getSession();
	return fetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
		},
		body: JSON.stringify(body)
	});
}
var STATUS_COLORS = {
	pending: "bg-amber-500/10 text-amber-400",
	in_progress: "bg-sky-500/10 text-sky-400",
	completed: "bg-emerald-500/10 text-emerald-400",
	partial: "bg-orange-500/10 text-orange-400",
	canceled: "bg-zinc-500/10 text-zinc-400",
	refunded: "bg-zinc-500/10 text-zinc-400",
	failed: "bg-red-500/10 text-red-400"
};
function SmmOrdersAdmin() {
	const qc = useQueryClient();
	const [polling, setPolling] = (0, import_react.useState)(false);
	const [cronBusy, setCronBusy] = (0, import_react.useState)(false);
	const { data } = useQuery({
		queryKey: ["admin", "smm-orders"],
		queryFn: async () => {
			const { data: orders } = await supabase.from("smm_orders").select("*, smm_services(name)").order("created_at", { ascending: false }).limit(500);
			const list = orders ?? [];
			if (list.length === 0) return [];
			const ids = Array.from(new Set(list.map((o) => o.user_id)));
			const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", ids);
			const emailMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.email]));
			return list.map((o) => ({
				...o,
				user_email: emailMap[o.user_id] ?? "—"
			}));
		}
	});
	const { data: cronJob, refetch: refetchCron } = useQuery({
		queryKey: ["admin", "smm-cron"],
		queryFn: async () => {
			return (await (await authedFetch("/api/smm/admin/cron", { action: "status" })).json().catch(() => ({}))).job ?? null;
		}
	});
	const del = async (id) => {
		if (!confirm("Delete this order log?")) return;
		const { error } = await supabase.from("smm_orders").delete().eq("id", id);
		if (error) return toast.error(error.message);
		toast.success("Deleted");
		qc.invalidateQueries({ queryKey: ["admin", "smm-orders"] });
	};
	const refresh = async () => {
		setPolling(true);
		const r = await authedFetch("/api/public/smm/poll", {});
		setPolling(false);
		const j = await r.json().catch(() => ({}));
		if (!r.ok) return toast.error(j.error ?? "Poll failed");
		toast.success(`Refreshed ${j.updated ?? 0} of ${j.checked ?? 0} orders`);
		qc.invalidateQueries({ queryKey: ["admin", "smm-orders"] });
	};
	const toggleCron = async () => {
		setCronBusy(true);
		const action = cronJob ? "disable" : "enable";
		const r = await authedFetch("/api/smm/admin/cron", {
			action,
			every_minutes: 2
		});
		setCronBusy(false);
		const j = await r.json().catch(() => ({}));
		if (!r.ok) return toast.error(j.error ?? "Cron update failed");
		toast.success(action === "enable" ? "Auto-poll enabled (every 2 min)" : "Auto-poll disabled");
		refetchCron();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-zinc-500",
					children: "SMM"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white",
					children: "SMM Orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-zinc-500",
					children: ["Auto-poll: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cronJob ? "text-emerald-400" : "text-zinc-400",
						children: cronJob ? `on (${cronJob.schedule})` : "off"
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: toggleCron,
					disabled: cronBusy,
					className: "inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50",
					children: cronJob ? "Disable auto-poll" : "Enable auto-poll"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: refresh,
					disabled: polling,
					className: "inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 ${polling ? "animate-spin" : ""}` }), " Refresh statuses"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[820px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "When"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "User"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Service"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Link"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-right",
							children: "Qty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-right",
							children: "Charge"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-right",
							children: "Refund"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-right",
							children: "Remains"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-center",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "p-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 10,
					className: "p-8 text-center text-zinc-500",
					children: "No orders yet."
				}) }) : data?.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-white/5 last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-[11px] text-zinc-500",
							children: new Date(o.created_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-xs text-zinc-300",
							children: o.user_email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-xs text-zinc-200",
							children: o.smm_services?.name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-xs text-zinc-400 max-w-[180px] truncate",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: o.link,
								target: "_blank",
								rel: "noreferrer",
								className: "hover:text-vault-gold-light",
								children: o.link
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-right tabular-nums text-zinc-300",
							children: o.quantity.toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-right tabular-nums text-zinc-100",
							children: formatNaira(o.charge_kobo)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-right tabular-nums text-emerald-400",
							children: o.refund_kobo ? formatNaira(o.refund_kobo) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-right tabular-nums text-zinc-400",
							children: o.remains ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[o.status] ?? "bg-zinc-500/10 text-zinc-400"}`,
								children: o.status.replace("_", " ")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => del(o.id),
								className: "text-red-400 hover:text-red-300",
								"aria-label": "Delete order log",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})
						})
					]
				}, o.id)) })]
			})
		})]
	});
}
//#endregion
export { SmmOrdersAdmin as component };
