import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Generic external-provider sync endpoint.
 *
 * Auth: requires either
 *  - `Authorization: Bearer <user-token>` where the user has the `admin` role, OR
 *  - `x-cron-secret: <PROVIDER_SYNC_CRON_SECRET>` header for scheduled callers.
 */
export const Route = createFileRoute("/api/public/providers/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const admin = getSupabaseAdmin();

        // Auth: cron secret OR admin user
        const cronSecret = process.env.PROVIDER_SYNC_CRON_SECRET;
        const providedSecret = request.headers.get("x-cron-secret");
        let authorized = false;

        if (cronSecret && providedSecret && providedSecret === cronSecret) {
          authorized = true;
        } else {
          const auth = request.headers.get("authorization");
          if (auth?.startsWith("Bearer ")) {
            const token = auth.slice("Bearer ".length);
            const { data: userData, error: userErr } = await admin.auth.getUser(token);
            if (!userErr && userData.user) {
              const { data: isAdmin } = await admin.rpc("has_role", {
                _user_id: userData.user.id,
                _role: "admin",
              });
              if (isAdmin) authorized = true;
            }
          }
        }

        if (!authorized) {
          return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
        }

        const { data: providers } = await admin
          .from("external_providers")
          .select("*")
          .eq("is_active", true);

        const report: Array<{ slug: string; status: string; note?: string }> = [];

        for (const p of providers ?? []) {
          const apiKey = p.api_key_secret_name ? process.env[p.api_key_secret_name] : null;
          if (!apiKey) {
            report.push({ slug: p.slug, status: "skipped", note: "API key not configured" });
            continue;
          }
          report.push({ slug: p.slug, status: "no-adapter" });
        }

        return Response.json({ ran_at: new Date().toISOString(), providers: report });
      },
    },
  },
});
