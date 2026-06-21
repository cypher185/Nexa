import { i as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-Cj3KZ6-B.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-7T2UG58p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)({
	session: null,
	user: null,
	loading: true,
	isAdmin: false,
	refreshRole: async () => {},
	signOut: async () => {}
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const checkRole = async (uid) => {
		if (!uid) {
			setIsAdmin(false);
			return;
		}
		const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
		setIsAdmin(Boolean(data));
	};
	const enforceBan = async (uid) => {
		if (!uid) return false;
		const { data } = await supabase.from("profiles").select("is_banned").eq("id", uid).maybeSingle();
		if (data?.is_banned) {
			await supabase.auth.signOut();
			setSession(null);
			setUser(null);
			setIsAdmin(false);
			if (typeof window !== "undefined") {
				const { toast } = await import("../_libs/sonner.mjs").then((n) => n.n);
				toast.error("Your account has been suspended.");
			}
			return true;
		}
		return false;
	};
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
			setUser(s?.user ?? null);
			setTimeout(async () => {
				if (s?.user?.id) {
					if (!await enforceBan(s.user.id)) checkRole(s.user.id);
				} else checkRole(void 0);
			}, 0);
		});
		supabase.auth.getSession().then(async ({ data }) => {
			setSession(data.session);
			setUser(data.session?.user ?? null);
			if (data.session?.user?.id) {
				if (!await enforceBan(data.session.user.id)) await checkRole(data.session.user.id);
			}
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			session,
			user,
			loading,
			isAdmin,
			refreshRole: async () => checkRole(user?.id),
			signOut: async () => {
				await supabase.auth.signOut();
				setSession(null);
				setUser(null);
				setIsAdmin(false);
			}
		},
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
//#endregion
export { useAuth as n, AuthProvider as t };
