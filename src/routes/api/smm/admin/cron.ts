import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authAdmin } from "@/lib/smm/auth.server";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

const schema = z.object({
  action: z.enum(["enable", "disable", "status"]),
  every_minutes: z.number().int().min(1).max(60).optional(),
  url: z.string().url().optional(),
});

export const Route = createFileRoute("/api/smm/admin/cron")({
  server: {
    handlers: {
      POST: async ({ request }) => {
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

        // enable
        const secret = process.env.SMM_CRON_SECRET;
        if (!secret) return Response.json({ error: "SMM_CRON_SECRET not set" }, { status: 500 });

        const origin = new URL(request.url).origin;
        const url = parsed.data.url ?? `${origin}/api/public/smm/poll`;
        const every = parsed.data.every_minutes ?? 2;

        const { error: e } = await admin.rpc("admin_setup_smm_cron", {
          _url: url,
          _secret: secret,
          _every_minutes: every,
        });
        if (e) return Response.json({ error: e.message }, { status: 500 });
        return Response.json({ ok: true, url, every_minutes: every });
      },
    },
  },
});
