import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { A as Clock, M as CircleAlert, j as CircleCheck, m as RefreshCw } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.smm-poll-log-WrndKzVa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SmmPollLog() {
	const qc = useQueryClient();
	const [running, setRunning] = (0, import_react.useState)(false);
	const [expandedOrder, setExpandedOrder] = (0, import_react.useState)(null);
	const { data: polls } = useQuery({
		queryKey: ["admin", "smm-poll-log"],
		queryFn: async () => {
			const { data } = await supabase.from("smm_poll_log").select("*").order("started_at", { ascending: false }).limit(50);
			return data ?? [];
		},
		refetchInterval: 15e3
	});
	const { data: events } = useQuery({
		queryKey: ["admin", "smm-order-events"],
		queryFn: async () => {
			const { data } = await supabase.from("smm_order_events").select("*, smm_orders(link, quantity, service_id)").order("created_at", { ascending: false }).limit(100);
			return data ?? [];
		},
		refetchInterval: 15e3
	});
	const runNow = async () => {
		setRunning(true);
		try {
			const { data: { session } } = await supabase.auth.getSession();
			const r = await fetch("/api/public/smm/poll", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
				},
				body: "{}"
			});
			const json = await r.json().catch(() => ({}));
			if (!r.ok) return toast.error(json.error ?? "Poll failed");
			toast.success(`Polled ${json.checked ?? 0} · updated ${json.updated ?? 0}`);
			qc.invalidateQueries({ queryKey: ["admin", "smm-poll-log"] });
			qc.invalidateQueries({ queryKey: ["admin", "smm-order-events"] });
		} finally {
			setRunning(false);
		}
	};
	const grouped = /* @__PURE__ */ new Map();
	for (const e of events ?? []) {
		const k = e.order_id ?? "_global";
		const arr = grouped.get(k) ?? [];
		arr.push(e);
		grouped.set(k, arr);
	}
	const lastPoll = polls?.[0];
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
						children: "Poll log"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 max-w-2xl text-xs text-zinc-500",
						children: [
							"Last poll: ",
							lastPoll ? new Date(lastPoll.started_at).toLocaleString() : "never",
							" ·",
							" ",
							lastPoll?.ok ? "ok" : lastPoll ? "with errors" : "—"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: runNow,
					disabled: running,
					className: "inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-4 ${running ? "animate-spin" : ""}` }), " Poll now"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-[11px] uppercase tracking-widest text-zinc-500",
				children: "Recent polls"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Started"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Source"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Checked"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Updated"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3 text-right",
								children: "Duration"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Errors"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (polls ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "p-8 text-center text-zinc-500",
						children: "No polls yet."
					}) }) : polls?.map((p) => {
						const dur = p.finished_at ? Math.round((new Date(p.finished_at).getTime() - new Date(p.started_at).getTime()) / 100) / 10 : null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-white/5 last:border-0 align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-[11px] text-zinc-300",
									children: new Date(p.started_at).toLocaleString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-[11px] text-zinc-400",
									children: p.source ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right tabular-nums text-zinc-200",
									children: p.checked
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right tabular-nums text-zinc-200",
									children: p.updated
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-right text-[11px] text-zinc-500",
									children: dur != null ? `${dur}s` : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "ml-auto size-3" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3",
									children: p.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-emerald-400 text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), " ok"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-red-400 text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3" }), " errors"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-3 text-[11px] text-red-300/80 max-w-md",
									children: p.errors ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "whitespace-pre-wrap break-words",
										children: Array.isArray(p.errors) ? p.errors.join("\n") : JSON.stringify(p.errors)
									}) : "—"
								})
							]
						}, p.id);
					}) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-[11px] uppercase tracking-widest text-zinc-500",
				children: "Recent order status changes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl bg-vault-surface ring-1 ring-white/5 divide-y divide-white/5",
				children: grouped.size === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-zinc-500 text-sm",
					children: "No order events yet."
				}) : [...grouped.entries()].map(([orderId, evtsMaybe]) => {
					const evts = evtsMaybe ?? [];
					if (evts.length === 0) return null;
					const isOpen = expandedOrder === orderId;
					const latest = evts[0];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setExpandedOrder(isOpen ? null : orderId),
							className: "flex w-full items-center justify-between gap-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-zinc-300 font-mono truncate",
									children: orderId.slice(0, 8)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-zinc-500 truncate",
									children: [
										latest.smm_orders?.link ?? "—",
										" · qty ",
										latest.smm_orders?.quantity ?? "—"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-zinc-400 shrink-0",
								children: [
									evts.length,
									" event",
									evts.length === 1 ? "" : "s"
								]
							})]
						}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 space-y-1 border-l border-white/10 pl-3 text-[11px] text-zinc-400",
							children: evts.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-baseline gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-zinc-500",
										children: new Date(e.created_at).toLocaleString()
									}),
									e.old_status && e.new_status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-zinc-200",
										children: [
											e.old_status,
											" → ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-vault-gold",
												children: e.new_status
											})
										]
									}) : null,
									e.remains != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-zinc-500",
										children: ["remains ", e.remains]
									}),
									e.start_count != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-zinc-500",
										children: ["start ", e.start_count]
									}),
									e.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-red-300/80",
										children: e.note
									})
								]
							}, e.id))
						})]
					}, orderId);
				})
			})] })
		]
	});
}
//#endregion
export { SmmPollLog as component };
