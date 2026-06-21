import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

export type AuthedUser = { id: string; email?: string };

/** Verify Bearer token and return user (or null + Response). Also blocks banned users. */
export async function authUser(request: Request): Promise<{ user: AuthedUser | null; error?: Response }> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return { user: null, error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  }
  const token = auth.slice("Bearer ".length);
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) {
    return { user: null, error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  }
  const { data: profile } = await admin
    .from("profiles").select("is_banned").eq("id", data.user.id).maybeSingle();
  if (profile?.is_banned) {
    return { user: null, error: Response.json({ error: "USER_BANNED" }, { status: 403 }) };
  }
  return { user: { id: data.user.id, email: data.user.email ?? undefined } };
}

export async function authAdmin(request: Request): Promise<{ user: AuthedUser | null; error?: Response }> {
  const { user, error } = await authUser(request);
  if (!user) return { user, error };
  const admin = getSupabaseAdmin();
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (!isAdmin) {
    return { user: null, error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }
  return { user };
}

/** Read FX rate (NGN per 1 USD) from site_settings (key `smm_ngn_per_usd`). Default 1600. */
export async function getNgnPerUsd(): Promise<number> {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("site_settings")
    .select("value")
    .eq("key", "smm_ngn_per_usd")
    .maybeSingle();
  const v = (data?.value as any)?.value;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 1600;
}
