import { i as __toESM } from "./_runtime.mjs";
import { n as supabase } from "./_ssr/client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/use-auth-7T2UG58p.mjs";
import { v as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as SiteHeader, t as SiteFooter } from "./_ssr/site-chrome-Bb2gtJDG.mjs";
import { r as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated.settings-B7c3PSK7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const signOut = async () => {
		await supabase.auth.signOut();
		navigate({ to: "/" });
	};
	const changePassword = async (e) => {
		e.preventDefault();
		if (password.length < 6) return toast.error("Password must be at least 6 chars");
		setSaving(true);
		const { error } = await supabase.auth.updateUser({ password });
		setSaving(false);
		if (error) return toast.error(error.message);
		setPassword("");
		toast.success("Password updated");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-2xl px-6 py-12 space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-zinc-500",
						children: "Account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-sora text-3xl font-semibold text-white",
						children: "Settings"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-sora text-base font-medium text-white",
							children: "Profile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b border-white/5 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-zinc-500",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-zinc-100",
									children: user?.email
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b border-white/5 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-zinc-500",
									children: "User ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-[11px] text-zinc-400",
									children: user?.id
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: changePassword,
						className: "rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-sora text-base font-medium text-white",
								children: "Change password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								placeholder: "New password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "mt-4 w-full rounded-xl border border-white/10 bg-vault-bg px-4 py-3 text-sm text-white outline-none focus:border-vault-gold/40"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: saving,
								className: "mt-4 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light disabled:opacity-60",
								children: "Update password"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: signOut,
						className: "w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20",
						children: "Sign out"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { SettingsPage as component };
