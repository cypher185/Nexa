import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { I as Activity, M as CircleAlert, O as Database, i as WifiOff, j as CircleCheck, r as Wifi } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.diagnostics-H2OzCCc3.js
var import_jsx_runtime = require_jsx_runtime();
function DiagnosticsPage() {
	const { data: diag, isLoading } = useQuery({
		queryKey: ["admin", "diagnostics"],
		queryFn: async () => {
			const results = {};
			const checks = [
				{
					key: "orders",
					label: "Orders",
					fn: () => supabase.from("orders").select("*", {
						count: "exact",
						head: true
					})
				},
				{
					key: "wallet_transactions",
					label: "Wallet Transactions",
					fn: () => supabase.from("wallet_transactions").select("*", {
						count: "exact",
						head: true
					})
				},
				{
					key: "smm_orders",
					label: "SMM Orders",
					fn: () => supabase.from("smm_orders").select("*", {
						count: "exact",
						head: true
					})
				},
				{
					key: "smm_services",
					label: "SMM Services",
					fn: () => supabase.from("smm_services").select("*", {
						count: "exact",
						head: true
					})
				},
				{
					key: "smm_providers",
					label: "SMM Providers",
					fn: () => supabase.from("smm_providers").select("*", {
						count: "exact",
						head: true
					})
				},
				{
					key: "products",
					label: "Products",
					fn: () => supabase.from("products").select("*", {
						count: "exact",
						head: true
					})
				},
				{
					key: "profiles",
					label: "Users",
					fn: () => supabase.from("profiles").select("*", {
						count: "exact",
						head: true
					})
				},
				{
					key: "smm_poll_log",
					label: "SMM Poll Log",
					fn: () => supabase.from("smm_poll_log").select("*", {
						count: "exact",
						head: true
					})
				}
			];
			for (const c of checks) {
				const start = performance.now();
				const { count, error } = await c.fn();
				const ms = Math.round(performance.now() - start);
				results[c.key] = {
					label: c.label,
					ok: !error,
					count: count ?? 0,
					error: error?.message ?? null,
					ms
				};
			}
			const { data: lastPoll } = await supabase.from("smm_poll_log").select("ok, errors, started_at, finished_at").order("started_at", { ascending: false }).limit(1).maybeSingle();
			const { data: lastFailed } = await supabase.from("smm_poll_log").select("errors, started_at").eq("ok", false).order("started_at", { ascending: false }).limit(1).maybeSingle();
			return {
				checks: results,
				lastPoll: lastPoll ?? null,
				lastFailedPoll: lastFailed ?? null
			};
		}
	});
	const allOk = diag ? Object.values(diag.checks).every((c) => c.ok) : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-zinc-500",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white",
					children: "Diagnostics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-xs text-zinc-500",
					children: "Health checks for all database queries and the last SMM API poll status."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [allOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-white",
						children: allOk ? "All systems healthy" : "Some checks failed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-zinc-500",
						children: isLoading ? "Running checks…" : `${Object.values(diag?.checks ?? {}).filter((c) => c.ok).length} / ${Object.keys(diag?.checks ?? {}).length} passing`
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: (isLoading ? Array.from({ length: 8 }) : Object.entries(diag?.checks ?? {})).map((item, i) => {
					if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5 animate-pulse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-24 rounded bg-zinc-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-6 w-12 rounded bg-zinc-700" })]
					}, i);
					const [key, c] = item;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `rounded-2xl bg-vault-surface p-4 ring-1 ${c.ok ? "ring-white/5" : "ring-red-500/20"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "size-4 text-zinc-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-zinc-400",
										children: c.label
									})]
								}), c.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 text-red-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-sora text-xl text-white tabular-nums",
								children: c.count.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-zinc-500",
								children: [c.ms, " ms"]
							}),
							c.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[11px] text-red-400 break-all",
								children: c.error
							})
						]
					}, key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-vault-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-white",
						children: "SMM API Poll Status"
					})]
				}), diag?.lastPoll ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-lg bg-vault-bg/40 p-3",
							children: [diag.lastPoll.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-4 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "size-4 text-red-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400",
									children: "Last poll"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-sm font-semibold ${diag.lastPoll.ok ? "text-emerald-400" : "text-red-400"}`,
									children: diag.lastPoll.ok ? "Successful" : "Failed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-zinc-500",
									children: new Date(diag.lastPoll.started_at).toLocaleString()
								})
							] })]
						}),
						diag.lastFailedPoll && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-vault-bg/40 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-zinc-400",
									children: "Last failure"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-red-400",
									children: new Date(diag.lastFailedPoll.started_at).toLocaleString()
								}),
								diag.lastFailedPoll.errors && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-2 text-[11px] text-red-300 break-all whitespace-pre-wrap",
									children: JSON.stringify(diag.lastFailedPoll.errors, null, 2)
								})
							]
						}),
						!diag.lastFailedPoll && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-vault-bg/40 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-zinc-400",
								children: "Last failure"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-emerald-400",
								children: "No failed polls recorded"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500",
					children: "No poll log entries yet. The SMM auto-poll cron job may not be configured."
				})]
			})
		]
	});
}
//#endregion
export { DiagnosticsPage as component };
