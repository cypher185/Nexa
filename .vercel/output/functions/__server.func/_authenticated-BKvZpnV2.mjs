import { i as __toESM } from "./_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/use-auth-7T2UG58p.mjs";
import { f as Outlet, v as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { b as LoaderCircle } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_authenticated-BKvZpnV2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthGuard() {
	const { user, loading, isAdmin } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			navigate({
				to: "/auth",
				search: {
					mode: "signin",
					redirect: window.location.pathname
				}
			});
			return;
		}
		if (isAdmin) navigate({ to: "/admin" });
	}, [
		user,
		isAdmin,
		loading,
		navigate
	]);
	if (loading || !user || isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-vault-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-vault-gold" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
//#endregion
export { AuthGuard as component };
