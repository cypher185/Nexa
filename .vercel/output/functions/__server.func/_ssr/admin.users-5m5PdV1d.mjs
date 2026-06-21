import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as Wallet, l as Shield, u as ShieldOff } from "../_libs/lucide-react.mjs";
import { r as nairaToKobo, t as formatNaira } from "./format-DrTbiGi6.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-5m5PdV1d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UsersAdmin() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [adjusting, setAdjusting] = (0, import_react.useState)(null);
	const { data } = useQuery({
		queryKey: [
			"admin",
			"users",
			search
		],
		queryFn: async () => {
			let q = supabase.from("profiles").select("id, email, full_name, is_banned, created_at").order("created_at", { ascending: false }).limit(200);
			if (search) q = q.ilike("email", `%${search}%`);
			const { data: profiles } = await q;
			const ids = (profiles ?? []).map((p) => p.id);
			if (ids.length === 0) return [];
			const [{ data: wallets }, { data: roles }] = await Promise.all([supabase.from("wallets").select("user_id, balance_kobo").in("user_id", ids), supabase.from("user_roles").select("user_id, role").in("user_id", ids)]);
			const w = Object.fromEntries((wallets ?? []).map((x) => [x.user_id, x.balance_kobo]));
			const rByUser = {};
			(roles ?? []).forEach((r) => {
				rByUser[r.user_id] ??= [];
				rByUser[r.user_id].push(r.role);
			});
			return (profiles ?? []).map((p) => ({
				...p,
				balance: w[p.id] ?? 0,
				isAdmin: (rByUser[p.id] ?? []).includes("admin")
			}));
		}
	});
	const toggleAdmin = async (userId, isAdmin) => {
		if (isAdmin) {
			if (!confirm("Revoke admin?")) return;
			await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
			toast.success("Admin revoked");
		} else {
			await supabase.from("user_roles").insert({
				user_id: userId,
				role: "admin"
			});
			toast.success("Granted admin");
		}
		qc.invalidateQueries({ queryKey: ["admin", "users"] });
	};
	const toggleBan = async (userId, isBanned) => {
		await supabase.from("profiles").update({ is_banned: !isBanned }).eq("id", userId);
		qc.invalidateQueries({ queryKey: ["admin", "users"] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-zinc-500",
					children: "People"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-sora text-3xl font-semibold text-white",
					children: "Users"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					placeholder: "Search by email…",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "w-72 rounded-lg border border-white/10 bg-vault-surface px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[560px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Balance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "p-8 text-center text-zinc-500",
						children: "No users."
					}) }) : data?.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-white/5 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-100",
								children: u.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-zinc-400",
								children: u.full_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right font-medium text-white tabular-nums",
								children: formatNaira(u.balance)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.isAdmin ? "bg-vault-gold/10 text-vault-gold-light" : "bg-zinc-700/40 text-zinc-400"}`,
									children: u.isAdmin ? "admin" : "user"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.is_banned ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`,
									children: u.is_banned ? "banned" : "active"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-4 text-right space-x-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setAdjusting(u.id),
										className: "text-vault-gold-light text-xs hover:underline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "inline size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleAdmin(u.id, u.isAdmin),
										className: "text-vault-gold-light hover:underline",
										children: u.isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "inline size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "inline size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleBan(u.id, u.is_banned),
										className: "text-xs text-red-400 hover:underline",
										children: u.is_banned ? "Unban" : "Ban"
									})
								]
							})
						]
					}, u.id)) })]
				})
			}),
			adjusting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdjustModal, {
				userId: adjusting,
				onClose: () => {
					setAdjusting(null);
					qc.invalidateQueries({ queryKey: ["admin", "users"] });
				}
			})
		]
	});
}
function AdjustModal({ userId, onClose }) {
	const [amount, setAmount] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("credit");
	const submit = async () => {
		const naira = Number(amount);
		if (!Number.isFinite(naira) || naira <= 0) return toast.error("Enter a positive amount");
		const kobo = nairaToKobo(naira) * (type === "credit" ? 1 : -1);
		const { data: wallet } = await supabase.from("wallets").select("balance_kobo").eq("user_id", userId).maybeSingle();
		const newBalance = (wallet?.balance_kobo ?? 0) + kobo;
		if (newBalance < 0) return toast.error("Would result in negative balance");
		const upd = await supabase.from("wallets").upsert({
			user_id: userId,
			balance_kobo: newBalance,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (upd.error) return toast.error(upd.error.message);
		const tx = await supabase.from("wallet_transactions").insert({
			user_id: userId,
			type: "adjust",
			status: "success",
			amount_kobo: kobo,
			balance_after_kobo: newBalance,
			description: reason || `Manual ${type} by admin`
		});
		if (tx.error) return toast.error(tx.error.message);
		toast.success("Adjusted");
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/70 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-sora text-lg font-semibold text-white",
					children: "Adjust wallet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setType("credit"),
						className: `rounded-lg px-3 py-2 text-sm font-medium ${type === "credit" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-zinc-400"}`,
						children: "Credit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setType("debit"),
						className: `rounded-lg px-3 py-2 text-sm font-medium ${type === "debit" ? "bg-red-500/10 text-red-400" : "bg-white/5 text-zinc-400"}`,
						children: "Debit"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-widest text-zinc-500",
						children: "Amount (₦)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-widest text-zinc-500",
						children: "Reason"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: reason,
						onChange: (e) => setReason(e.target.value),
						placeholder: "Refund for order #...",
						className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: submit,
						className: "rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
						children: "Apply"
					})]
				})
			]
		})
	});
}
//#endregion
export { UsersAdmin as component };
