import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-Cj3KZ6-B.js
var url = "https://jimhjiprdiatnqskxjkt.supabase.co";
var key = void 0;
console.warn("[NexaLogs] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env and fill them in.");
var supabase = createClient(url, "placeholder", { auth: {
	persistSession: true,
	autoRefreshToken: true,
	detectSessionInUrl: true
} });
var isSupabaseConfigured = Boolean(key);
//#endregion
export { supabase as n, isSupabaseConfigured as t };
