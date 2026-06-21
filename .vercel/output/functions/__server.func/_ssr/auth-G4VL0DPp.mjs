import { i as __toESM } from "../_runtime.mjs";
import { n as supabase, t as isSupabaseConfigured } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./use-auth-7T2UG58p.mjs";
import { g as Link, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as LoaderCircle } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-G4VL0DPp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const search = useSearch({ from: "/auth" });
	const navigate = useNavigate();
	const { user, loading, isAdmin } = useAuth();
	const [mode, setMode] = (0, import_react.useState)(search.mode ?? "signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({ to: search.redirect ?? (isAdmin ? "/admin" : "/dashboard") });
	}, [
		user,
		isAdmin,
		loading,
		navigate,
		search.redirect
	]);
	const submit = async (e) => {
		e.preventDefault();
		if (!isSupabaseConfigured) {
			toast.error("Supabase not configured", { description: "Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env." });
			return;
		}
		setSubmitting(true);
		if (mode === "signup") {
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: { full_name: fullName },
					emailRedirectTo: typeof window !== "undefined" ? window.location.origin : void 0
				}
			});
			setSubmitting(false);
			if (error) return toast.error(error.message);
			toast.success("Account created!", { description: "You're now signed in." });
		} else {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			setSubmitting(false);
			if (error) return toast.error(error.message);
			toast.success("Welcome back");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen grid-cols-1 bg-vault-bg lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden flex-col justify-between overflow-hidden bg-vault-surface p-12 lg:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -left-24 size-96 rounded-full bg-vault-gold/10 blur-[120px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "relative font-sora text-2xl font-semibold text-vault-gold-light",
					children: "NexaLogs"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "max-w-md font-sora text-4xl font-semibold text-white",
						children: ["Your vault for ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gold-text",
							children: "premium aged accounts."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-md text-sm text-zinc-400",
						children: "Fund a wallet once. Buy instantly. Credentials delivered the second the transaction confirms — no waiting, no DMs."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "relative text-[10px] uppercase tracking-widest text-zinc-600",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" NexaLogs Nigeria"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center px-6 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mb-12 block font-sora text-xl font-semibold text-vault-gold-light lg:hidden",
						children: "NexaLogs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-sora text-2xl font-semibold text-white",
						children: mode === "signup" ? "Create your account" : "Welcome back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-zinc-500",
						children: mode === "signup" ? "Start funding your wallet and buying in seconds." : "Sign in to access your wallet and purchases."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-8 space-y-4",
						onSubmit: submit,
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium uppercase tracking-wide text-zinc-500",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								required: true,
								className: "mt-1.5 w-full rounded-xl border border-white/10 bg-vault-surface px-4 py-3 text-sm text-white outline-none focus:border-vault-gold/40"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium uppercase tracking-wide text-zinc-500",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								className: "mt-1.5 w-full rounded-xl border border-white/10 bg-vault-surface px-4 py-3 text-sm text-white outline-none focus:border-vault-gold/40"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium uppercase tracking-wide text-zinc-500",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 6,
								className: "mt-1.5 w-full rounded-xl border border-white/10 bg-vault-surface px-4 py-3 text-sm text-white outline-none focus:border-vault-gold/40"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: submitting,
								className: "flex w-full items-center justify-center gap-2 rounded-xl bg-vault-gold px-4 py-3 text-sm font-semibold text-vault-bg transition hover:bg-vault-gold-light disabled:opacity-60",
								children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), mode === "signup" ? "Create account" : "Sign in"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-center text-sm text-zinc-500",
						children: [mode === "signup" ? "Already have an account? " : "Don't have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMode(mode === "signup" ? "signin" : "signup"),
							className: "font-medium text-vault-gold-light hover:underline",
							children: mode === "signup" ? "Sign in" : "Create one"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-12 text-center text-[10px] text-zinc-600",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-zinc-400",
							children: "← Back to home"
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
