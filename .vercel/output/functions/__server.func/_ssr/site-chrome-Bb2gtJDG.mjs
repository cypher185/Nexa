import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./use-auth-7T2UG58p.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as X, v as Menu, y as LogOut } from "../_libs/lucide-react.mjs";
import { n as formatNairaDecimal } from "./format-DrTbiGi6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-chrome-Bb2gtJDG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteHeader() {
	const { user, loading, isAdmin, signOut } = useAuth();
	const navigate = useNavigate();
	const [balance, setBalance] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user || isAdmin) {
			setBalance(null);
			return;
		}
		let cancelled = false;
		const fetchBalance = async () => {
			const { data } = await supabase.from("wallets").select("balance_kobo").eq("user_id", user.id).maybeSingle();
			if (!cancelled) setBalance(data?.balance_kobo ?? 0);
		};
		fetchBalance();
		const interval = setInterval(fetchBalance, 15e3);
		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, [user, isAdmin]);
	const handleSignOut = async () => {
		setOpen(false);
		await signOut();
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "sticky top-0 z-50 border-b border-white/5 bg-vault-bg/80 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "shrink-0 font-sora text-lg sm:text-xl font-semibold tracking-tight text-vault-gold-light",
						children: "NexaLogs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden gap-6 text-sm font-medium md:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/browse",
								className: "text-zinc-400 transition-colors hover:text-vault-gold-light",
								children: "Marketplace"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/smm",
								className: "text-zinc-400 transition-colors hover:text-vault-gold-light",
								children: "SMM"
							}),
							user && !isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/purchases",
								className: "text-zinc-400 transition-colors hover:text-vault-gold-light",
								children: "My Accounts"
							}),
							user && !isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/smm-orders",
								className: "text-zinc-400 transition-colors hover:text-vault-gold-light",
								children: "SMM Orders"
							}),
							user && !isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/wallet",
								className: "text-zinc-400 transition-colors hover:text-vault-gold-light",
								children: "Wallet"
							}),
							isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin",
								className: "text-vault-gold transition-colors hover:text-vault-gold-light",
								children: "Admin"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-3 md:flex",
					children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/fund",
						className: "flex items-center gap-2 rounded-full border border-vault-gold/20 bg-vault-gold/5 py-1.5 pr-4 pl-2 ring-1 ring-vault-gold/10 transition-colors hover:bg-vault-gold/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2 animate-pulse rounded-full bg-vault-gold" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sora text-xs font-medium tracking-wide text-vault-gold-light uppercase",
								children: "Balance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-white tabular-nums",
								children: balance === null ? "—" : formatNairaDecimal(balance)
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "grid size-9 place-items-center rounded-full bg-zinc-800 ring-1 ring-white/10 text-xs font-semibold text-vault-gold-light uppercase",
						"aria-label": "Dashboard",
						children: user.email?.[0] ?? "U"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSignOut,
						className: "inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), " Sign out"]
					})] }) : !loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "text-sm font-medium text-zinc-400 hover:text-vault-gold-light",
						children: "Sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { mode: "signup" },
						className: "rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg transition-colors hover:bg-vault-gold-light",
						children: "Create account"
					})] }) : null
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "shrink-0 md:hidden text-zinc-300",
					onClick: () => setOpen((v) => !v),
					"aria-label": "Menu",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-6" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:hidden border-t border-white/5 bg-vault-bg px-4 py-4 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/browse",
					onClick: () => setOpen(false),
					className: "block text-sm text-zinc-300",
					children: "Marketplace"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/smm",
					onClick: () => setOpen(false),
					className: "block text-sm text-zinc-300",
					children: "SMM Services"
				}),
				user && !isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						onClick: () => setOpen(false),
						className: "block text-sm text-zinc-300",
						children: "Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/purchases",
						onClick: () => setOpen(false),
						className: "block text-sm text-zinc-300",
						children: "My Accounts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/smm-orders",
						onClick: () => setOpen(false),
						className: "block text-sm text-zinc-300",
						children: "My SMM Orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/wallet",
						onClick: () => setOpen(false),
						className: "block text-sm text-zinc-300",
						children: [
							"Wallet (",
							balance === null ? "—" : formatNairaDecimal(balance),
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/fund",
						onClick: () => setOpen(false),
						className: "block text-sm font-semibold text-vault-gold-light",
						children: "+ Fund wallet"
					})
				] }),
				isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					onClick: () => setOpen(false),
					className: "block text-sm font-semibold text-vault-gold",
					children: "Admin panel"
				}),
				user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleSignOut,
					className: "flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Sign out"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					onClick: () => setOpen(false),
					className: "block text-sm text-zinc-300",
					children: "Sign in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					search: { mode: "signup" },
					onClick: () => setOpen(false),
					className: "block text-sm font-semibold text-vault-gold-light",
					children: "Create account"
				})] })
			]
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-white/5 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sora text-lg font-semibold text-vault-gold-light",
					children: "NexaLogs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[10px] text-zinc-500",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" NexaLogs. All rights reserved."
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-8 text-xs font-medium text-zinc-500",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/browse",
					className: "hover:text-zinc-300",
					children: "Marketplace"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "mailto:support@nexalogs.com",
					className: "hover:text-zinc-300",
					children: "Support"
				})]
			})]
		})
	});
}
//#endregion
export { SiteHeader as n, SiteFooter as t };
