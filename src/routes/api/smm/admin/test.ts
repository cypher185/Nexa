import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authAdmin } from "@/lib/smm/auth.server";
import { smmPanel } from "@/lib/smm/panel-client.server";

const schema = z.object({
  api_url: z.string().url(),
  api_key: z.string().min(1),
});

export const Route = createFileRoute("/api/smm/admin/test")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { error } = await authAdmin(request);
        if (error) return error;
        const body = await request.json().catch(() => ({}));
        const parsed = schema.safeParse(body);
        if (!parsed.success) return Response.json({ error: "INVALID_BODY" }, { status: 400 });
        try {
          const panel = smmPanel(parsed.data.api_url, parsed.data.api_key);
          const [balance, services] = await Promise.all([
            panel.balance(),
            panel.services().catch(() => [] as any[]),
          ]);
          const categories = new Set<string>();
          for (const s of services ?? []) {
            if (s?.category) categories.add(String(s.category));
          }
          return Response.json({
            ok: true,
            balance,
            services_count: Array.isArray(services) ? services.length : 0,
            categories_count: categories.size,
          });
        } catch (e: any) {
          return Response.json({ ok: false, error: e?.message ?? "PANEL_ERROR" }, { status: 502 });
        }
      },
    },
  },
});
