import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { getSupabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/webhooks/korapay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const secret = process.env.KORAPAY_WEBHOOK_SECRET;
        if (!secret) return new Response("WEBHOOK_NOT_CONFIGURED", { status: 503 });

        // Korapay sends an HMAC SHA256 signature in `x-korapay-signature` header,
        // computed over the JSON body's `data` field.
        const signature = request.headers.get("x-korapay-signature") ?? "";
        let payload: any;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("INVALID_JSON", { status: 400 });
        }

        const expected = createHmac("sha256", secret)
          .update(typeof payload.data === "string" ? payload.data : JSON.stringify(payload.data ?? {}))
          .digest("hex");
        try {
          const sig = Buffer.from(signature);
          const exp = Buffer.from(expected);
          if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) {
            return new Response("INVALID_SIGNATURE", { status: 401 });
          }
        } catch {
          return new Response("INVALID_SIGNATURE", { status: 401 });
        }

        const data = payload.data ?? {};
        const reference = data.reference as string | undefined;
        const status = data.status as string | undefined;
        const amountNaira = Number(data.amount ?? 0);
        const korapayRef = data.payment_reference ?? data.transaction_reference ?? null;

        if (!reference) return new Response("MISSING_REFERENCE", { status: 400 });

        const admin = getSupabaseAdmin();

        // Find the pending transaction
        const { data: tx } = await admin
          .from("wallet_transactions")
          .select("id, user_id, status, amount_kobo")
          .eq("reference", reference)
          .maybeSingle();

        if (!tx) return new Response("UNKNOWN_REFERENCE", { status: 200 }); // ack to stop retries
        if (tx.status === "success") return new Response("ALREADY_PROCESSED");

        if (status === "success" || status === "successful") {
          // credit via SQL function (idempotent)
          const { error } = await admin.rpc("credit_wallet", {
            _user_id: tx.user_id,
            _amount_kobo: Math.round(amountNaira * 100),
            _reference: reference,
            _korapay_ref: korapayRef,
          });
          if (error) {
            console.error("credit_wallet failed", error);
            return new Response("CREDIT_FAILED", { status: 500 });
          }
        } else {
          await admin
            .from("wallet_transactions")
            .update({ status: "failed", korapay_ref: korapayRef })
            .eq("id", tx.id);
        }

        return new Response("OK");
      },
    },
  },
});
