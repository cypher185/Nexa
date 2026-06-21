import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { formatNaira, nairaToKobo } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/fund")({
  component: FundPage,
});

const PRESETS = [1000, 2500, 5000, 10000, 25000, 50000];

function FundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(5000);
  const [loading, setLoading] = useState(false);

  // poll wallet for refresh after webhook
  useEffect(() => {
    if (!user) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("status") === "success") {
      toast.success("Payment received — wallet credited shortly", {
        description: "Refresh in a moment if your balance hasn't updated.",
      });
      void navigate({ to: "/wallet" });
    }
  }, [user, navigate]);

  const handleFund = async () => {
    if (amount < 100) {
      toast.error("Minimum funding is ₦100");
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/wallet/initialize-funding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ amount_kobo: nairaToKobo(amount) }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.error === "KORAPAY_NOT_CONFIGURED") {
          toast.error("Korapay not configured", {
            description: "Add your KORAPAY_SECRET_KEY in the server .env file.",
          });
        } else {
          toast.error(json.error || "Could not initialize payment");
        }
        return;
      }
      if (json.checkout_url) {
        window.location.href = json.checkout_url;
      } else {
        toast.error("No checkout URL returned");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vault-bg text-zinc-300">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-10 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Wallet</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Fund your wallet</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Powered by Korapay. Card, bank transfer, and USSD supported.
          </p>
        </header>

        <div className="rounded-3xl bg-vault-surface p-8 ring-1 ring-white/5">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Amount (₦)</label>
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-vault-bg px-4 py-3 focus-within:border-vault-gold/40">
            <span className="font-sora text-2xl font-semibold text-vault-gold-light">₦</span>
            <input
              type="number"
              min={100}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-transparent font-sora text-2xl font-semibold text-white outline-none"
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  amount === p
                    ? "border-vault-gold/40 bg-vault-gold/10 text-vault-gold-light"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"
                }`}
              >
                {formatNaira(p * 100)}
              </button>
            ))}
          </div>

          <button
            onClick={handleFund}
            disabled={loading || amount < 100}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-vault-gold px-4 py-3.5 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Continue to Korapay
          </button>

          <p className="mt-4 text-center text-[11px] text-zinc-500">
            You'll be redirected to Korapay's secure checkout. Funds reflect within seconds.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
