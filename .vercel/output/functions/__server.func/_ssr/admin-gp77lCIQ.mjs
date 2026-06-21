import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./use-auth-7T2UG58p.mjs";
import { f as Outlet, g as Link, l as useRouterState, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as ArrowLeft, I as Activity, S as Layers, T as FolderTree, _ as Package, a as Wallet, b as LoaderCircle, c as ShoppingBag, f as Settings, g as Plug, o as Users, t as Zap, x as LayoutDashboard, y as LogOut } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-gp77lCIQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/admin",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/products",
		label: "Products",
		icon: Package
	},
	{
		to: "/admin/categories",
		label: "Categories",
		icon: FolderTree
	},
	{
		to: "/admin/orders",
		label: "Orders",
		icon: ShoppingBag
	},
	{
		to: "/admin/users",
		label: "Users",
		icon: Users
	},
	{
		to: "/admin/wallet",
		label: "Transactions",
		icon: Wallet
	},
	{
		to: "/admin/providers",
		label: "Providers",
		icon: Plug
	},
	{
		to: "/admin/smm-providers",
		label: "SMM Panels",
		icon: Zap
	},
	{
		to: "/admin/smm-services",
		label: "SMM Services",
		icon: Layers
	},
	{
		to: "/admin/smm-orders",
		label: "SMM Orders",
		icon: Activity
	},
	{
		to: "/admin/smm-poll-log",
		label: "SMM Poll Log",
		icon: Activity
	},
	{
		to: "/admin/diagnostics",
		label: "Diagnostics",
		icon: Activity
	},
	{
		to: "/admin/settings",
		label: "Settings",
		icon: Settings
	}
];
function AdminLayout() {
	const { user, loading, isAdmin, signOut } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const handleSignOut = async () => {
		await signOut();
		navigate({ to: "/" });
	};
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			navigate({
				to: "/auth",
				search: {
					mode: "signin",
					redirect: "/admin"
				}
			});
			return;
		}
		if (!isAdmin) navigate({ to: "/" });
	}, [
		user,
		isAdmin,
		loading,
		navigate
	]);
	if (loading || !user || !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-vault-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-vault-gold" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-vault-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/5 bg-vault-surface/40 p-6 md:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sora text-lg font-semibold text-vault-gold-light",
							children: "NexaLogs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 rounded-md bg-vault-gold/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-vault-gold",
							children: "Admin"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-10 space-y-1",
						children: NAV.map((n) => {
							const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: n.to,
								className: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-vault-gold/10 text-vault-gold-light" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "size-4" }), n.label]
							}, n.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "mt-10 flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3" }), " Back to storefront"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSignOut,
						className: "mt-4 flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), " Sign out"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-white/5 px-4 py-3 md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "font-sora text-base font-semibold text-vault-gold-light",
							children: "NexaLogs Admin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleSignOut,
							className: "inline-flex items-center gap-1 text-xs text-zinc-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), " Sign out"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-4 py-6 pb-24 md:px-10 md:py-10 md:pb-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto border-t border-white/5 bg-vault-bg/95 backdrop-blur md:hidden",
						children: NAV.map((n) => {
							const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: n.to,
								className: `flex min-w-[64px] shrink-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] ${active ? "text-vault-gold-light" : "text-zinc-500"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "size-4" }), n.label]
							}, n.to);
						})
					})
				]
			})]
		})
	});
}
//#endregion
export { AdminLayout as component };
