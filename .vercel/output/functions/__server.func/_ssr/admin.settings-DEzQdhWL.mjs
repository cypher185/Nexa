import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { N as Check, k as Copy } from "../_libs/lucide-react.mjs";
import { r as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-DEzQdhWL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsAdmin() {
	const qc = useQueryClient();
	const [origin, setOrigin] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const { data } = useQuery({
		queryKey: ["admin", "settings"],
		queryFn: async () => {
			const { data } = await supabase.from("site_settings").select("*");
			const map = {};
			(data ?? []).forEach((r) => map[r.key] = r.value);
			return map;
		}
	});
	const [supportEmail, setSupportEmail] = (0, import_react.useState)("");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") setOrigin(window.location.origin);
		if (data) {
			setSupportEmail(data.support_email?.value ?? "");
			setWhatsapp(data.support_whatsapp?.value ?? "");
		}
	}, [data]);
	const save = async () => {
		const rows = [{
			key: "support_email",
			value: { value: supportEmail },
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, {
			key: "support_whatsapp",
			value: { value: whatsapp },
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}];
		const { error } = await supabase.from("site_settings").upsert(rows);
		if (error) return toast.error(error.message);
		toast.success("Saved");
		qc.invalidateQueries({ queryKey: ["admin", "settings"] });
	};
	const webhookUrl = `${origin}/api/public/webhooks/korapay`;
	const copyHook = () => {
		navigator.clipboard.writeText(webhookUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-zinc-500",
				children: "System"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-sora text-3xl font-semibold text-white",
				children: "Settings"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-sora text-base font-medium text-white",
						children: "Korapay configuration"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-zinc-500",
						children: "Add these env vars on your server. Don't put them in client code."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-xs",
						children: [
							"KORAPAY_PUBLIC_KEY",
							"KORAPAY_SECRET_KEY",
							"KORAPAY_WEBHOOK_SECRET"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between rounded-lg bg-vault-bg px-3 py-2 ring-1 ring-white/5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono text-vault-gold-light",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-zinc-500",
								children: "required"
							})]
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "Webhook URL (paste into Korapay dashboard)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-2 rounded-lg bg-vault-bg px-3 py-2 ring-1 ring-white/5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "flex-1 font-mono text-xs text-vault-gold-light line-clamp-1",
								children: webhookUrl
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copyHook,
								className: "text-vault-gold-light hover:text-white",
								children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-sora text-base font-medium text-white",
						children: "Support contacts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "Support email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: supportEmail,
							onChange: (e) => setSupportEmail(e.target.value),
							className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-widest text-zinc-500",
							children: "WhatsApp number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: whatsapp,
							onChange: (e) => setWhatsapp(e.target.value),
							className: "mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: save,
						className: "mt-5 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light",
						children: "Save"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-sora text-base font-medium text-white",
						children: "Bootstrap admin (first time)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-zinc-500",
						children: "After signing up, run this in the Supabase SQL editor to promote your account:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-3 overflow-auto rounded-lg bg-vault-bg p-4 font-mono text-[11px] text-vault-gold-light ring-1 ring-white/5",
						children: `insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'YOUR@EMAIL.COM'
on conflict do nothing;`
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsAdmin as component };
