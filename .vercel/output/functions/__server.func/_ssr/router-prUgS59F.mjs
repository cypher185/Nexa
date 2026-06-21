import { i as __toESM } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { a as require_react, i as require_jsx_runtime, n as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as AuthProvider } from "./use-auth-7T2UG58p.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$36 } from "./smm._serviceId-BzhvAx7d.mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
import { createHmac, timingSafeEqual } from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-prUgS59F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-B8ydIwNP.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-vault-bg px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-sora text-7xl font-semibold gold-text",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-sora text-xl font-semibold text-white",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-zinc-500",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-lg bg-vault-gold px-5 py-2.5 text-sm font-semibold text-vault-bg transition-colors hover:bg-vault-gold-light",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-vault-bg px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-sora text-xl font-semibold tracking-tight text-white",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-zinc-500",
					children: "Something went wrong on our end. Try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-lg bg-vault-gold px-5 py-2.5 text-sm font-semibold text-vault-bg transition-colors hover:bg-vault-gold-light",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$35 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "NexaLogs — Premium aged social accounts, delivered instantly" },
			{
				name: "description",
				content: "Nigeria's premium marketplace for aged social media accounts. Facebook, Instagram, TikTok, X, Gmail and more — delivered instantly to your wallet."
			},
			{
				property: "og:title",
				content: "NexaLogs — Premium aged social accounts, delivered instantly"
			},
			{
				property: "og:description",
				content: "Nigeria's premium marketplace for aged social media accounts."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "theme-color",
				content: "#0d0d0d"
			},
			{
				name: "twitter:title",
				content: "NexaLogs — Premium aged social accounts, delivered instantly"
			},
			{
				name: "description",
				content: "NexaLogs Social Hub is a web-based platform for managing and selling social media accounts."
			},
			{
				property: "og:description",
				content: "NexaLogs Social Hub is a web-based platform for managing and selling social media accounts."
			},
			{
				name: "twitter:description",
				content: "NexaLogs Social Hub is a web-based platform for managing and selling social media accounts."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a2cf8103-1534-471f-82c5-dbd6c8be67ea/id-preview-bcdb72ac--50a5aaac-0d32-4bfc-94a2-80ae87096309.lovable.app-1782032789334.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a2cf8103-1534-471f-82c5-dbd6c8be67ea/id-preview-bcdb72ac--50a5aaac-0d32-4bfc-94a2-80ae87096309.lovable.app-1782032789334.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-vault-bg text-foreground",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$35.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			theme: "dark",
			position: "top-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$26 = () => import("./smm-BbQ2wVbP.mjs");
var Route$34 = createFileRoute("/smm")({
	head: () => ({ meta: [
		{ title: "SMM Services — NexaLogs" },
		{
			name: "description",
			content: "Boost any social profile — followers, likes, views and more. Auto-delivered, wallet-paid."
		},
		{
			property: "og:title",
			content: "SMM Services — NexaLogs"
		},
		{
			property: "og:description",
			content: "Auto-delivered SMM services for Instagram, TikTok, YouTube, X and more."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./browse-BMoqvYJ4.mjs");
var Route$33 = createFileRoute("/browse")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./auth-G4VL0DPp.mjs");
var searchSchema = objectType({
	mode: enumType(["signin", "signup"]).optional().default("signin").catch("signin"),
	redirect: stringType().optional()
});
var Route$32 = createFileRoute("/auth")({
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./admin-gp77lCIQ.mjs");
var Route$31 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("../_authenticated-BKvZpnV2.mjs");
var Route$30 = createFileRoute("/_authenticated")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./routes-DdfiZTHS.mjs");
var Route$29 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./admin.index-Bc7zrf8s.mjs");
var Route$28 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./category._slug-D6S9EfXN.mjs");
var Route$27 = createFileRoute("/category/$slug")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./admin.wallet-BZcO2TxT.mjs");
var Route$26 = createFileRoute("/admin/wallet")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin.users-5m5PdV1d.mjs");
var Route$25 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin.smm-services-DqsnITbB.mjs");
var Route$24 = createFileRoute("/admin/smm-services")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./admin.smm-providers-B6mGnh8y.mjs");
var Route$23 = createFileRoute("/admin/smm-providers")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin.smm-poll-log-WrndKzVa.mjs");
var Route$22 = createFileRoute("/admin/smm-poll-log")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./admin.smm-orders-DyoqyFvy.mjs");
var Route$21 = createFileRoute("/admin/smm-orders")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.settings-DEzQdhWL.mjs");
var Route$20 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.providers-CMt8TWz-.mjs");
var Route$19 = createFileRoute("/admin/providers")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.products-BZbunRsE.mjs");
var Route$18 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin.orders-B38y6Tpj.mjs");
var Route$17 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.diagnostics-H2OzCCc3.mjs");
var Route$16 = createFileRoute("/admin/diagnostics")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.categories-B_fuD3UE.mjs");
var Route$15 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./account._id-DPVDSEr3.mjs");
var Route$14 = createFileRoute("/account/$id")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("../_authenticated.wallet-CP5EMk75.mjs");
var Route$13 = createFileRoute("/_authenticated/wallet")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("../_authenticated.smm-orders-DxCl9gNg.mjs");
var Route$12 = createFileRoute("/_authenticated/smm-orders")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_authenticated.settings-B7c3PSK7.mjs");
var Route$11 = createFileRoute("/_authenticated/settings")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("../_authenticated.purchases-DcVhmibn.mjs");
var Route$10 = createFileRoute("/_authenticated/purchases")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_authenticated.fund-BbkFdx4I.mjs");
var Route$9 = createFileRoute("/_authenticated/fund")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("../_authenticated.dashboard-7_UppGHV.mjs");
var Route$8 = createFileRoute("/_authenticated/dashboard")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var _admin = null;
function getSupabaseAdmin() {
	if (_admin) return _admin;
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. See .env.example.");
	_admin = createClient(url, key, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
	return _admin;
}
var Route$7 = createFileRoute("/api/wallet/initialize-funding")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const auth = request.headers.get("authorization");
		if (!auth?.startsWith("Bearer ")) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
		const token = auth.slice(7);
		const admin = getSupabaseAdmin();
		const { data: userData, error: userErr } = await admin.auth.getUser(token);
		if (userErr || !userData.user) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
		const user = userData.user;
		const body = await request.json().catch(() => ({}));
		const parsed = objectType({ amount_kobo: numberType().int().min(1e4) }).safeParse(body);
		if (!parsed.success) return Response.json({ error: "INVALID_AMOUNT" }, { status: 400 });
		const secretKey = process.env.KORAPAY_SECRET_KEY;
		if (!secretKey) return Response.json({ error: "KORAPAY_NOT_CONFIGURED" }, { status: 503 });
		const reference = `nxl_${crypto.randomUUID()}`;
		const { error: insErr } = await admin.from("wallet_transactions").insert({
			user_id: user.id,
			type: "fund",
			status: "pending",
			amount_kobo: parsed.data.amount_kobo,
			reference,
			description: "Korapay funding (pending)"
		});
		if (insErr) return Response.json({ error: insErr.message }, { status: 500 });
		const origin = new URL(request.url).origin;
		const koraRes = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${secretKey}`
			},
			body: JSON.stringify({
				amount: parsed.data.amount_kobo / 100,
				currency: "NGN",
				reference,
				customer: {
					email: user.email,
					name: user.user_metadata?.full_name || user.email
				},
				notification_url: `${origin}/api/public/webhooks/korapay`,
				redirect_url: `${origin}/fund?status=success`,
				metadata: { user_id: user.id }
			})
		});
		const koraJson = await koraRes.json();
		if (!koraRes.ok || !koraJson?.data?.checkout_url) {
			console.error("Korapay init failed", {
				status: koraRes.status,
				body: koraJson
			});
			return Response.json({ error: "PAYMENT_GATEWAY_ERROR" }, { status: 502 });
		}
		return Response.json({
			reference,
			checkout_url: koraJson.data.checkout_url
		});
	} catch (err) {
		console.error("init-funding error", err);
		return Response.json({ error: "INTERNAL_ERROR" }, { status: 500 });
	}
} } } });
/** Verify Bearer token and return user (or null + Response). Also blocks banned users. */
async function authUser(request) {
	const auth = request.headers.get("authorization");
	if (!auth?.startsWith("Bearer ")) return {
		user: null,
		error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 })
	};
	const token = auth.slice(7);
	const admin = getSupabaseAdmin();
	const { data, error } = await admin.auth.getUser(token);
	if (error || !data.user) return {
		user: null,
		error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 })
	};
	const { data: profile } = await admin.from("profiles").select("is_banned").eq("id", data.user.id).maybeSingle();
	if (profile?.is_banned) return {
		user: null,
		error: Response.json({ error: "USER_BANNED" }, { status: 403 })
	};
	return { user: {
		id: data.user.id,
		email: data.user.email ?? void 0
	} };
}
async function authAdmin(request) {
	const { user, error } = await authUser(request);
	if (!user) return {
		user,
		error
	};
	const { data: isAdmin } = await getSupabaseAdmin().rpc("has_role", {
		_user_id: user.id,
		_role: "admin"
	});
	if (!isAdmin) return {
		user: null,
		error: Response.json({ error: "FORBIDDEN" }, { status: 403 })
	};
	return { user };
}
/** Read FX rate (NGN per 1 USD) from site_settings (key `smm_ngn_per_usd`). Default 1600. */
async function getNgnPerUsd() {
	const { data } = await getSupabaseAdmin().from("site_settings").select("value").eq("key", "smm_ngn_per_usd").maybeSingle();
	const v = (data?.value)?.value;
	const n = Number(v);
	return Number.isFinite(n) && n > 0 ? n : 1600;
}
async function panelCall(apiUrl, apiKey, params) {
	const body = new URLSearchParams({
		key: apiKey,
		...params
	});
	const res = await fetch(apiUrl, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body
	});
	const text = await res.text();
	let json;
	try {
		json = JSON.parse(text);
	} catch {
		throw new Error(`SMM panel returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
	}
	if (!res.ok) throw new Error(`SMM panel error ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
	if (json && typeof json === "object" && "error" in json && json.error) throw new Error(`SMM panel error: ${json.error}`);
	return json;
}
function smmPanel(apiUrl, apiKey) {
	return {
		services: () => panelCall(apiUrl, apiKey, { action: "services" }),
		balance: () => panelCall(apiUrl, apiKey, { action: "balance" }),
		addOrder: (service, link, quantity) => panelCall(apiUrl, apiKey, {
			action: "add",
			service,
			link,
			quantity: String(quantity)
		}),
		status: (orderIds) => {
			if (orderIds.length === 1) return panelCall(apiUrl, apiKey, {
				action: "status",
				order: orderIds[0]
			}).then((r) => ({ [orderIds[0]]: r }));
			return panelCall(apiUrl, apiKey, {
				action: "status",
				orders: orderIds.join(",")
			});
		}
	};
}
/** Normalize panel status string → internal smm_order_status enum value. */
function normalizeStatus(raw) {
	const s = (raw ?? "").toLowerCase().trim();
	if (s === "pending") return "pending";
	if (s === "in progress" || s === "processing") return "in_progress";
	if (s === "completed" || s === "complete") return "completed";
	if (s === "partial") return "partial";
	if (s === "canceled" || s === "cancelled") return "canceled";
	if (s === "refunded") return "refunded";
	if (s === "fail" || s === "failed" || s === "error") return "failed";
	return "in_progress";
}
/** USD per-1000 → NGN kobo per 1 unit (rate × qty / 1000). */
function priceKobo(rateUsdPer1000, markupPct, qty, ngnPerUsd) {
	const ngnCost = rateUsdPer1000 * qty / 1e3 * ngnPerUsd * (1 + markupPct / 100);
	return Math.ceil(ngnCost * 100);
}
var schema$3 = objectType({
	service_id: stringType().uuid(),
	link: stringType().url().max(2e3),
	quantity: numberType().int().positive().max(1e7)
});
var Route$6 = createFileRoute("/api/smm/place-order")({ server: { handlers: { POST: async ({ request }) => {
	const { user, error } = await authUser(request);
	if (error || !user) return error ?? Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
	const body = await request.json().catch(() => ({}));
	const parsed = schema$3.safeParse(body);
	if (!parsed.success) return Response.json({ error: "INVALID_BODY" }, { status: 400 });
	const admin = getSupabaseAdmin();
	const { data: svc } = await admin.from("smm_services").select("*, smm_providers(id, api_url, api_key, enabled)").eq("id", parsed.data.service_id).eq("enabled", true).eq("visible", true).maybeSingle();
	if (!svc) return Response.json({ error: "SERVICE_NOT_FOUND" }, { status: 404 });
	const provider = svc.smm_providers;
	if (!provider?.enabled) return Response.json({ error: "PROVIDER_DISABLED" }, { status: 503 });
	const qty = parsed.data.quantity;
	if (qty < svc.min_qty || qty > svc.max_qty) return Response.json({
		error: "QUANTITY_OUT_OF_RANGE",
		min: svc.min_qty,
		max: svc.max_qty
	}, { status: 400 });
	const ngnPerUsd = await getNgnPerUsd();
	const charge = priceKobo(Number(svc.rate_usd_per_1000), Number(svc.markup_pct), qty, ngnPerUsd);
	const providerUsd = Number(svc.rate_usd_per_1000) * qty / 1e3;
	const { data: wallet } = await admin.from("wallets").select("balance_kobo").eq("user_id", user.id).maybeSingle();
	if (!wallet || wallet.balance_kobo < charge) return Response.json({
		error: "INSUFFICIENT_BALANCE",
		required_kobo: charge
	}, { status: 402 });
	let providerOrderId;
	try {
		const r = await smmPanel(provider.api_url, provider.api_key).addOrder(svc.provider_service_id, parsed.data.link, qty);
		providerOrderId = String(r.order);
	} catch (e) {
		return Response.json({ error: e?.message ?? "PANEL_ERROR" }, { status: 502 });
	}
	const { data: created, error: rpcErr } = await admin.rpc("create_smm_order", {
		_user_id: user.id,
		_service_id: parsed.data.service_id,
		_link: parsed.data.link,
		_quantity: qty,
		_charge_kobo: charge,
		_provider_order_id: providerOrderId,
		_provider_charge_usd: providerUsd
	});
	if (rpcErr) {
		console.error("create_smm_order failed", rpcErr, { providerOrderId });
		return Response.json({ error: rpcErr.message }, { status: 500 });
	}
	const row = Array.isArray(created) ? created[0] : created;
	return Response.json({
		ok: true,
		order_id: row?.order_id,
		balance_kobo: row?.balance_kobo,
		provider_order_id: providerOrderId,
		charge_kobo: charge
	});
} } } });
var schema$2 = objectType({
	api_url: stringType().url(),
	api_key: stringType().min(1)
});
var Route$5 = createFileRoute("/api/smm/admin/test")({ server: { handlers: { POST: async ({ request }) => {
	const { error } = await authAdmin(request);
	if (error) return error;
	const body = await request.json().catch(() => ({}));
	const parsed = schema$2.safeParse(body);
	if (!parsed.success) return Response.json({ error: "INVALID_BODY" }, { status: 400 });
	try {
		const panel = smmPanel(parsed.data.api_url, parsed.data.api_key);
		const [balance, services] = await Promise.all([panel.balance(), panel.services().catch(() => [])]);
		const categories = /* @__PURE__ */ new Set();
		for (const s of services ?? []) if (s?.category) categories.add(String(s.category));
		return Response.json({
			ok: true,
			balance,
			services_count: Array.isArray(services) ? services.length : 0,
			categories_count: categories.size
		});
	} catch (e) {
		return Response.json({
			ok: false,
			error: e?.message ?? "PANEL_ERROR"
		}, { status: 502 });
	}
} } } });
var schema$1 = objectType({ provider_id: stringType().uuid() });
function slugify(s) {
	return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "uncategorized";
}
var Route$4 = createFileRoute("/api/smm/admin/sync")({ server: { handlers: { POST: async ({ request }) => {
	const { error } = await authAdmin(request);
	if (error) return error;
	const body = await request.json().catch(() => ({}));
	const parsed = schema$1.safeParse(body);
	if (!parsed.success) return Response.json({ error: "INVALID_BODY" }, { status: 400 });
	const admin = getSupabaseAdmin();
	const { data: provider } = await admin.from("smm_providers").select("*").eq("id", parsed.data.provider_id).maybeSingle();
	if (!provider) return Response.json({ error: "PROVIDER_NOT_FOUND" }, { status: 404 });
	let services;
	let balance = null;
	try {
		const panel = smmPanel(provider.api_url, provider.api_key);
		services = await panel.services();
		try {
			balance = await panel.balance();
		} catch {}
	} catch (e) {
		return Response.json({ error: e?.message ?? "PANEL_ERROR" }, { status: 502 });
	}
	const { data: mk } = await admin.from("site_settings").select("value").eq("key", "smm_default_markup_pct").maybeSingle();
	const defaultMarkup = Number((mk?.value)?.value);
	const useDefault = Number.isFinite(defaultMarkup) && defaultMarkup >= 0;
	const uniqueCats = Array.from(new Set(services.map((s) => (s.category ?? "").toString().trim()).filter(Boolean)));
	const nameToId = /* @__PURE__ */ new Map();
	for (const name of uniqueCats) {
		const slug = slugify(name);
		const { data: existing } = await admin.from("smm_categories").select("id").eq("slug", slug).maybeSingle();
		if (existing) {
			nameToId.set(name, existing.id);
			continue;
		}
		const { data: ins } = await admin.from("smm_categories").insert({
			name,
			slug
		}).select("id").maybeSingle();
		if (ins) nameToId.set(name, ins.id);
	}
	let upserted = 0;
	let categoriesAssigned = 0;
	for (const s of services) {
		const provCat = (s.category ?? "").toString().trim();
		const catId = provCat ? nameToId.get(provCat) ?? null : null;
		const { data: existing } = await admin.from("smm_services").select("category_id, markup_pct").eq("provider_id", provider.id).eq("provider_service_id", String(s.service)).maybeSingle();
		const row = {
			provider_id: provider.id,
			provider_service_id: String(s.service),
			name: String(s.name ?? "Service"),
			type: s.type ?? null,
			provider_category: provCat || null,
			rate_usd_per_1000: Number(s.rate ?? 0),
			min_qty: parseInt(String(s.min ?? 1), 10) || 1,
			max_qty: parseInt(String(s.max ?? 1e6), 10) || 1e6,
			dripfeed: Boolean(s.dripfeed),
			refill: Boolean(s.refill),
			cancel: Boolean(s.cancel),
			description: s.description ?? null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (!existing?.category_id && catId) {
			row.category_id = catId;
			categoriesAssigned++;
		}
		if (!existing && useDefault) row.markup_pct = defaultMarkup;
		const { error: upErr } = await admin.from("smm_services").upsert(row, {
			onConflict: "provider_id,provider_service_id",
			ignoreDuplicates: false
		});
		if (!upErr) upserted++;
	}
	await admin.from("smm_providers").update({
		balance_usd: balance ? Number(balance.balance) : null,
		currency: balance?.currency ?? provider.currency ?? "USD",
		last_synced_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", provider.id);
	return Response.json({
		ok: true,
		services_synced: upserted,
		categories_created: nameToId.size,
		categories_assigned: categoriesAssigned,
		balance
	});
} } } });
var schema = objectType({
	action: enumType([
		"enable",
		"disable",
		"status"
	]),
	every_minutes: numberType().int().min(1).max(60).optional(),
	url: stringType().url().optional()
});
var Route$3 = createFileRoute("/api/smm/admin/cron")({ server: { handlers: { POST: async ({ request }) => {
	const { error } = await authAdmin(request);
	if (error) return error;
	const body = await request.json().catch(() => ({}));
	const parsed = schema.safeParse(body);
	if (!parsed.success) return Response.json({ error: "INVALID_BODY" }, { status: 400 });
	const admin = getSupabaseAdmin();
	if (parsed.data.action === "status") {
		const { data, error: e } = await admin.rpc("admin_smm_cron_status");
		if (e) return Response.json({ error: e.message }, { status: 500 });
		return Response.json({ job: (data ?? [])[0] ?? null });
	}
	if (parsed.data.action === "disable") {
		const { error: e } = await admin.rpc("admin_disable_smm_cron");
		if (e) return Response.json({ error: e.message }, { status: 500 });
		return Response.json({ ok: true });
	}
	const secret = process.env.SMM_CRON_SECRET;
	if (!secret) return Response.json({ error: "SMM_CRON_SECRET not set" }, { status: 500 });
	const origin = new URL(request.url).origin;
	const url = parsed.data.url ?? `${origin}/api/public/smm/poll`;
	const every = parsed.data.every_minutes ?? 2;
	const { error: e } = await admin.rpc("admin_setup_smm_cron", {
		_url: url,
		_secret: secret,
		_every_minutes: every
	});
	if (e) return Response.json({ error: e.message }, { status: 500 });
	return Response.json({
		ok: true,
		url,
		every_minutes: every
	});
} } } });
var Route$2 = createFileRoute("/api/public/webhooks/korapay")({ server: { handlers: { POST: async ({ request }) => {
	const rawBody = await request.text();
	const secret = process.env.KORAPAY_WEBHOOK_SECRET;
	if (!secret) return new Response("WEBHOOK_NOT_CONFIGURED", { status: 503 });
	const signature = request.headers.get("x-korapay-signature") ?? "";
	let payload;
	try {
		payload = JSON.parse(rawBody);
	} catch {
		return new Response("INVALID_JSON", { status: 400 });
	}
	const expected = createHmac("sha256", secret).update(typeof payload.data === "string" ? payload.data : JSON.stringify(payload.data ?? {})).digest("hex");
	try {
		const sig = Buffer.from(signature);
		const exp = Buffer.from(expected);
		if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) return new Response("INVALID_SIGNATURE", { status: 401 });
	} catch {
		return new Response("INVALID_SIGNATURE", { status: 401 });
	}
	const data = payload.data ?? {};
	const reference = data.reference;
	const status = data.status;
	const amountNaira = Number(data.amount ?? 0);
	const korapayRef = data.payment_reference ?? data.transaction_reference ?? null;
	if (!reference) return new Response("MISSING_REFERENCE", { status: 400 });
	const admin = getSupabaseAdmin();
	const { data: tx } = await admin.from("wallet_transactions").select("id, user_id, status, amount_kobo").eq("reference", reference).maybeSingle();
	if (!tx) return new Response("UNKNOWN_REFERENCE", { status: 200 });
	if (tx.status === "success") return new Response("ALREADY_PROCESSED");
	if (status === "success" || status === "successful") {
		const { error } = await admin.rpc("credit_wallet", {
			_user_id: tx.user_id,
			_amount_kobo: Math.round(amountNaira * 100),
			_reference: reference,
			_korapay_ref: korapayRef
		});
		if (error) {
			console.error("credit_wallet failed", error);
			return new Response("CREDIT_FAILED", { status: 500 });
		}
	} else await admin.from("wallet_transactions").update({
		status: "failed",
		korapay_ref: korapayRef
	}).eq("id", tx.id);
	return new Response("OK");
} } } });
/**
* Poll pending/in-progress SMM orders against their upstream panel and update
* status. Refunds wallet for canceled (full) and partial orders.
*
* Auth: header `x-cron-secret: <SMM_CRON_SECRET>` OR admin Bearer token.
*/
var Route$1 = createFileRoute("/api/public/smm/poll")({ server: { handlers: { POST: async ({ request }) => {
	const admin = getSupabaseAdmin();
	const cronSecret = process.env.SMM_CRON_SECRET;
	const provided = request.headers.get("x-cron-secret");
	let authorized = Boolean(cronSecret && provided && provided === cronSecret);
	let source = provided ? "cron" : "manual";
	if (!authorized) {
		const auth = request.headers.get("authorization");
		if (auth?.startsWith("Bearer ")) {
			const { data } = await admin.auth.getUser(auth.slice(7));
			if (data.user) {
				const { data: isAdmin } = await admin.rpc("has_role", {
					_user_id: data.user.id,
					_role: "admin"
				});
				if (isAdmin) {
					authorized = true;
					source = "manual";
				}
			}
		}
	}
	if (!authorized) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
	const { data: pollRow } = await admin.from("smm_poll_log").insert({
		source,
		started_at: (/* @__PURE__ */ new Date()).toISOString()
	}).select("id").single();
	const pollId = pollRow?.id;
	const finish = async (payload) => {
		if (pollId) await admin.from("smm_poll_log").update({
			finished_at: (/* @__PURE__ */ new Date()).toISOString(),
			checked: payload.checked,
			updated: payload.updated,
			errors: payload.errors.length ? payload.errors : null,
			ok: payload.ok
		}).eq("id", pollId);
		return Response.json({
			ok: payload.ok,
			checked: payload.checked,
			updated: payload.updated,
			errors: payload.errors,
			...payload.extra
		});
	};
	const { data: orders } = await admin.from("smm_orders").select("id, provider_id, provider_order_id, status, charge_kobo, refund_kobo, quantity").in("status", ["pending", "in_progress"]).not("provider_order_id", "is", null).limit(500);
	if (!orders || orders.length === 0) return finish({
		checked: 0,
		updated: 0,
		errors: [],
		ok: true
	});
	const byProvider = /* @__PURE__ */ new Map();
	for (const o of orders) {
		const arr = byProvider.get(o.provider_id) ?? [];
		arr.push(o);
		byProvider.set(o.provider_id, arr);
	}
	const ngnPerUsd = await getNgnPerUsd();
	let updated = 0;
	const errors = [];
	for (const [providerId, list] of byProvider) {
		const { data: provider } = await admin.from("smm_providers").select("api_url, api_key").eq("id", providerId).maybeSingle();
		if (!provider) continue;
		for (let i = 0; i < list.length; i += 100) {
			const chunk = list.slice(i, i + 100);
			try {
				const result = await smmPanel(provider.api_url, provider.api_key).status(chunk.map((o) => o.provider_order_id));
				for (const o of chunk) {
					const r = result[o.provider_order_id] ?? result[String(o.provider_order_id)];
					if (!r) continue;
					const newStatus = normalizeStatus(r.status);
					const remains = r.remains != null ? parseInt(String(r.remains), 10) : null;
					const startCount = r.start_count != null ? parseInt(String(r.start_count), 10) : null;
					const oldStatus = o.status;
					const updates = {
						status: newStatus,
						remains,
						start_count: startCount,
						last_polled_at: (/* @__PURE__ */ new Date()).toISOString(),
						updated_at: (/* @__PURE__ */ new Date()).toISOString()
					};
					await admin.from("smm_orders").update(updates).eq("id", o.id);
					if (newStatus !== oldStatus) await admin.from("smm_order_events").insert({
						order_id: o.id,
						poll_id: pollId,
						old_status: oldStatus,
						new_status: newStatus,
						remains,
						start_count: startCount
					});
					if (newStatus === "canceled" && o.refund_kobo === 0) await admin.rpc("refund_smm_order", {
						_order_id: o.id,
						_amount_kobo: o.charge_kobo,
						_reason: "SMM order canceled — full refund"
					});
					else if (newStatus === "partial" && o.refund_kobo === 0 && remains != null && remains > 0) {
						const refund = Math.floor(o.charge_kobo * remains / o.quantity);
						if (refund > 0) await admin.rpc("refund_smm_order", {
							_order_id: o.id,
							_amount_kobo: refund,
							_reason: `SMM partial refund (${remains} of ${o.quantity} remaining)`
						});
					}
					updated++;
				}
			} catch (e) {
				const msg = `provider ${providerId}: ${e?.message ?? e}`;
				errors.push(msg);
				if (pollId) await admin.from("smm_order_events").insert({
					order_id: chunk[0]?.id ?? null,
					poll_id: pollId,
					note: msg
				});
			}
		}
	}
	return finish({
		checked: orders.length,
		updated,
		errors,
		ok: errors.length === 0,
		extra: { ngn_per_usd: ngnPerUsd }
	});
} } } });
/**
* Generic external-provider sync endpoint.
*
* Auth: requires either
*  - `Authorization: Bearer <user-token>` where the user has the `admin` role, OR
*  - `x-cron-secret: <PROVIDER_SYNC_CRON_SECRET>` header for scheduled callers.
*/
var Route = createFileRoute("/api/public/providers/sync")({ server: { handlers: { POST: async ({ request }) => {
	const admin = getSupabaseAdmin();
	const cronSecret = process.env.PROVIDER_SYNC_CRON_SECRET;
	const providedSecret = request.headers.get("x-cron-secret");
	let authorized = false;
	if (cronSecret && providedSecret && providedSecret === cronSecret) authorized = true;
	else {
		const auth = request.headers.get("authorization");
		if (auth?.startsWith("Bearer ")) {
			const token = auth.slice(7);
			const { data: userData, error: userErr } = await admin.auth.getUser(token);
			if (!userErr && userData.user) {
				const { data: isAdmin } = await admin.rpc("has_role", {
					_user_id: userData.user.id,
					_role: "admin"
				});
				if (isAdmin) authorized = true;
			}
		}
	}
	if (!authorized) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
	const { data: providers } = await admin.from("external_providers").select("*").eq("is_active", true);
	const report = [];
	for (const p of providers ?? []) {
		if (!(p.api_key_secret_name ? process.env[p.api_key_secret_name] : null)) {
			report.push({
				slug: p.slug,
				status: "skipped",
				note: "API key not configured"
			});
			continue;
		}
		report.push({
			slug: p.slug,
			status: "no-adapter"
		});
	}
	return Response.json({
		ran_at: (/* @__PURE__ */ new Date()).toISOString(),
		providers: report
	});
} } } });
var SmmRoute = Route$34.update({
	id: "/smm",
	path: "/smm",
	getParentRoute: () => Route$35
});
var BrowseRoute = Route$33.update({
	id: "/browse",
	path: "/browse",
	getParentRoute: () => Route$35
});
var AuthRoute = Route$32.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$35
});
var AdminRoute = Route$31.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$35
});
var AuthenticatedRoute = Route$30.update({
	id: "/_authenticated",
	getParentRoute: () => Route$35
});
var IndexRoute = Route$29.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$35
});
var AdminIndexRoute = Route$28.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var SmmServiceIdRoute = Route$36.update({
	id: "/$serviceId",
	path: "/$serviceId",
	getParentRoute: () => SmmRoute
});
var CategorySlugRoute = Route$27.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$35
});
var AdminWalletRoute = Route$26.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => AdminRoute
});
var AdminUsersRoute = Route$25.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRoute
});
var AdminSmmServicesRoute = Route$24.update({
	id: "/smm-services",
	path: "/smm-services",
	getParentRoute: () => AdminRoute
});
var AdminSmmProvidersRoute = Route$23.update({
	id: "/smm-providers",
	path: "/smm-providers",
	getParentRoute: () => AdminRoute
});
var AdminSmmPollLogRoute = Route$22.update({
	id: "/smm-poll-log",
	path: "/smm-poll-log",
	getParentRoute: () => AdminRoute
});
var AdminSmmOrdersRoute = Route$21.update({
	id: "/smm-orders",
	path: "/smm-orders",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$20.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminProvidersRoute = Route$19.update({
	id: "/providers",
	path: "/providers",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$18.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$17.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminDiagnosticsRoute = Route$16.update({
	id: "/diagnostics",
	path: "/diagnostics",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$15.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AccountIdRoute = Route$14.update({
	id: "/account/$id",
	path: "/account/$id",
	getParentRoute: () => Route$35
});
var AuthenticatedWalletRoute = Route$13.update({
	id: "/wallet",
	path: "/wallet",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSmmOrdersRoute = Route$12.update({
	id: "/smm-orders",
	path: "/smm-orders",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedSettingsRoute = Route$11.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedPurchasesRoute = Route$10.update({
	id: "/purchases",
	path: "/purchases",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedFundRoute = Route$9.update({
	id: "/fund",
	path: "/fund",
	getParentRoute: () => AuthenticatedRoute
});
var AuthenticatedDashboardRoute = Route$8.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRoute
});
var ApiWalletInitializeFundingRoute = Route$7.update({
	id: "/api/wallet/initialize-funding",
	path: "/api/wallet/initialize-funding",
	getParentRoute: () => Route$35
});
var ApiSmmPlaceOrderRoute = Route$6.update({
	id: "/api/smm/place-order",
	path: "/api/smm/place-order",
	getParentRoute: () => Route$35
});
var ApiSmmAdminTestRoute = Route$5.update({
	id: "/api/smm/admin/test",
	path: "/api/smm/admin/test",
	getParentRoute: () => Route$35
});
var ApiSmmAdminSyncRoute = Route$4.update({
	id: "/api/smm/admin/sync",
	path: "/api/smm/admin/sync",
	getParentRoute: () => Route$35
});
var ApiSmmAdminCronRoute = Route$3.update({
	id: "/api/smm/admin/cron",
	path: "/api/smm/admin/cron",
	getParentRoute: () => Route$35
});
var ApiPublicWebhooksKorapayRoute = Route$2.update({
	id: "/api/public/webhooks/korapay",
	path: "/api/public/webhooks/korapay",
	getParentRoute: () => Route$35
});
var ApiPublicSmmPollRoute = Route$1.update({
	id: "/api/public/smm/poll",
	path: "/api/public/smm/poll",
	getParentRoute: () => Route$35
});
var ApiPublicProvidersSyncRoute = Route.update({
	id: "/api/public/providers/sync",
	path: "/api/public/providers/sync",
	getParentRoute: () => Route$35
});
var AuthenticatedRouteChildren = {
	AuthenticatedDashboardRoute,
	AuthenticatedFundRoute,
	AuthenticatedPurchasesRoute,
	AuthenticatedSettingsRoute,
	AuthenticatedSmmOrdersRoute,
	AuthenticatedWalletRoute
};
var AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(AuthenticatedRouteChildren);
var AdminRouteChildren = {
	AdminCategoriesRoute,
	AdminDiagnosticsRoute,
	AdminOrdersRoute,
	AdminProductsRoute,
	AdminProvidersRoute,
	AdminSettingsRoute,
	AdminSmmOrdersRoute,
	AdminSmmPollLogRoute,
	AdminSmmProvidersRoute,
	AdminSmmServicesRoute,
	AdminUsersRoute,
	AdminWalletRoute,
	AdminIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var SmmRouteChildren = { SmmServiceIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRoute: AuthenticatedRouteWithChildren,
	AdminRoute: AdminRouteWithChildren,
	AuthRoute,
	BrowseRoute,
	SmmRoute: SmmRoute._addFileChildren(SmmRouteChildren),
	AccountIdRoute,
	CategorySlugRoute,
	ApiSmmPlaceOrderRoute,
	ApiWalletInitializeFundingRoute,
	ApiPublicProvidersSyncRoute,
	ApiPublicSmmPollRoute,
	ApiPublicWebhooksKorapayRoute,
	ApiSmmAdminCronRoute,
	ApiSmmAdminSyncRoute,
	ApiSmmAdminTestRoute
};
var routeTree = Route$35._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
