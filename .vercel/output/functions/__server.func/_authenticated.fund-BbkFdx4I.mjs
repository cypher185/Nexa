import { i as __toESM } from "./_runtime.mjs";
import { n as supabase } from "./_ssr/client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/use-auth-7T2UG58p.mjs";
import { v as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { b as LoaderCircle } from "./_libs/lucide-react.mjs";
import { r as nairaToKobo, t as formatNaira } from "./_ssr/format-DrTbiGi6.mjs";
import { n as SiteHeader, t as SiteFooter } from "./_ssr/site-chrome-Bb2gtJDG.mjs";
import { r as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated.fund-BbkFdx4I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRESETS = [
	1e3,
	2500,
	5e3,
	1e4,
	25e3,
	5e4
];
function FundPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [amount, setAmount] = (0, import_react.useState)(5e3);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		if (new URL(window.location.href).searchParams.get("status") === "success") {
			toast.success("Payment received — wallet credited shortly", { description: "Refresh in a moment if your balance hasn't updated." });
			navigate({ to: "/wallet" });
		}
	}, [user, navigate]);
	const handleFund = async () => {
		if (amount < 100) {
			toast.error("Minimum funding is ₦100");
			return;
		}
		setLoading(true);
		try {
			const { data: { session } } = await supabase.auth.getSession();
			const res = await fetch("/api/wallet/initialize-funding", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.access_token ?? ""}`
				},
				body: JSON.stringify({ amount_kobo: nairaToKobo(amount) })
			});
			const json = await res.json();
			if (!res.ok) {
				if (json.error === "KORAPAY_NOT_CONFIGURED") toast.error("Korapay not configured", { description: "Add your KORAPAY_SECRET_KEY in the server .env file." });
				else toast.error(json.error || "Could not initialize payment");
				return;
			}
			if (json.checkout_url) window.location.href = json.checkout_url;
			else toast.error("No checkout URL returned");
		} catch (err) {
			toast.error(err?.message ?? "Network error");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-vault-bg text-zinc-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-2xl px-6 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-widest text-zinc-500",
							children: "Wallet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-sora text-3xl font-semibold text-white",
							children: "Fund your wallet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-zinc-500",
							children: "Powered by Korapay. Card, bank transfer, and USSD supported."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-vault-surface p-8 ring-1 ring-white/5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs uppercase tracking-widest text-zinc-500",
							children: "Amount (₦)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-vault-bg px-4 py-3 focus-within:border-vault-gold/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sora text-2xl font-semibold text-vault-gold-light",
								children: "₦"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 100,
								step: 100,
								value: amount,
								onChange: (e) => setAmount(Number(e.target.value)),
								className: "w-full bg-transparent font-sora text-2xl font-semibold text-white outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 grid grid-cols-3 gap-2",
							children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setAmount(p),
								className: `rounded-lg border px-3 py-2 text-sm font-medium transition ${amount === p ? "border-vault-gold/40 bg-vault-gold/10 text-vault-gold-light" : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"}`,
								children: formatNaira(p * 100)
							}, p))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleFund,
							disabled: loading || amount < 100,
							className: "mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-vault-gold px-4 py-3.5 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light disabled:opacity-60",
							children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Continue to Korapay"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-center text-[11px] text-zinc-500",
							children: "You'll be redirected to Korapay's secure checkout. Funds reflect within seconds."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { FundPage as component };
