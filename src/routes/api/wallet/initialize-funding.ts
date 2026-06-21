import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/wallet/initialize-funding")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = request.headers.get("authorization");
          if (!auth?.startsWith("Bearer ")) {
            return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
          }
          const token = auth.slice("Bearer ".length);

          const admin = getSupabaseAdmin();
          const { data: userData, error: userErr } = await admin.auth.getUser(token);
          if (userErr || !userData.user) {
            return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
          }
          const user = userData.user;

          const body = await request.json().catch(() => ({}));
          const parsed = z
            .object({ amount_kobo: z.number().int().min(10000) }) // ₦100 min
            .safeParse(body);
          if (!parsed.success) {
            return Response.json({ error: "INVALID_AMOUNT" }, { status: 400 });
          }

          const secretKey = process.env.KORAPAY_SECRET_KEY;
          if (!secretKey) {
            return Response.json({ error: "KORAPAY_NOT_CONFIGURED" }, { status: 503 });
          }

          const reference = `nxl_${crypto.randomUUID()}`;

          // Insert pending wallet_transaction (admin client bypasses RLS)
          const { error: insErr } = await admin.from("wallet_transactions").insert({
            user_id: user.id,
            type: "fund",
            status: "pending",
            amount_kobo: parsed.data.amount_kobo,
            reference,
            description: "Korapay funding (pending)",
          });
          if (insErr) {
            return Response.json({ error: insErr.message }, { status: 500 });
          }

          const origin = new URL(request.url).origin;
          const koraRes = await fetch("https://api.korapay.com/merchant/api/v1/charges/initialize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${secretKey}`,
            },
            body: JSON.stringify({
              amount: parsed.data.amount_kobo / 100, // Korapay expects naira
              currency: "NGN",
              reference,
              customer: {
                email: user.email,
                name: user.user_metadata?.full_name || user.email,
              },
              notification_url: `${origin}/api/public/webhooks/korapay`,
              redirect_url: `${origin}/fund?status=success`,
              metadata: { user_id: user.id },
            }),
          });

          const koraJson: any = await koraRes.json();
          if (!koraRes.ok || !koraJson?.data?.checkout_url) {
            console.error("Korapay init failed", { status: koraRes.status, body: koraJson });
            return Response.json(
              { error: "PAYMENT_GATEWAY_ERROR" },
              { status: 502 },
            );
          }

          return Response.json({
            reference,
            checkout_url: koraJson.data.checkout_url,
          });
        } catch (err: any) {
          console.error("init-funding error", err);
          return Response.json({ error: "INTERNAL_ERROR" }, { status: 500 });
        }
      },
    },
  },
});
