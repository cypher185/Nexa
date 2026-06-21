import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { useAuth } from "@/hooks/use-auth";
import { useMemo, useState } from "react";
import { formatNaira } from "@/lib/format";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/smm/$serviceId")({
  component: SmmServiceDetail,
});

const DEFAULT_NGN_PER_USD = 1600;

function SmmServiceDetail() {
  const { serviceId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [link, setLink] = useState("");
  const [qty, setQty] = useState<string>("");
  const [placing, setPlacing] = useState(false);

  const { data: rate } = useQuery({
    queryKey: ["smm-rate"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "smm_ngn_per_usd").maybeSingle();
      return Number((data?.value as any)?.value) || DEFAULT_NGN_PER_USD;
    },
  });

  const { data: svc, isLoading } = useQuery({
    queryKey: ["smm-service", serviceId],
    queryFn: async () => (
      await supabase.from("smm_services").select("*, smm_categories(name)").eq("id", serviceId).maybeSingle()
    ).data,
  });

  const ngnPerUsd = rate ?? DEFAULT_NGN_PER_USD;
  const qtyNum = parseInt(qty, 10) || 0;
  const price = useMemo(() => {
    if (!svc || !qtyNum) return 0;
    return Math.ceil((Number(svc.rate_usd_per_1000) * qtyNum * ngnPerUsd) / 1000 * (1 + Number(svc.markup_pct) / 100));
  }, [svc, qtyNum, ngnPerUsd]);

  const submit = async () => {
    if (!user) {
      void navigate({ to: "/auth", search: { mode: "signin", redirect: `/smm/${serviceId}` } });
      return;
    }
    if (!svc) return;
    if (!link.trim()) return toast.error("Enter the target link");
    if (qtyNum < svc.min_qty || qtyNum > svc.max_qty) {
      return toast.error(`Quantity must be between ${svc.min_qty} and ${svc.max_qty}`);
    }
    setPlacing(true);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/smm/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ service_id: svc.id, link: link.trim(), quantity: qtyNum }),
    });
    setPlacing(false);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (json.error === "INSUFFICIENT_BALANCE") {
        toast.error("Not enough wallet balance");
        void navigate({ to: "/fund" });
        return;
      }
      return toast.error(json.error ?? "Order failed");
    }
    toast.success("Order placed!");
    void navigate({ to: "/smm-orders" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vault-bg">
        <SiteHeader />
        <div className="grid h-[60vh] place-items-center"><Loader2 className="size-6 animate-spin text-vault-gold" /></div>
      </div>
    );
  }

  if (!svc) {
    return (
      <div className="min-h-screen bg-vault-bg">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="text-zinc-400">Service not found.</p>
          <Link to="/smm" className="mt-4 inline-flex items-center gap-2 text-vault-gold-light">
            <ArrowLeft className="size-4" /> Back to catalog
          </Link>
        </main>
      </div>
    );
  }

  const ngnPer1k = Math.ceil(Number(svc.rate_usd_per_1000) * ngnPerUsd * (1 + Number(svc.markup_pct) / 100));

  return (
    <div className="min-h-screen bg-vault-bg">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link to="/smm" className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-vault-gold-light">
          <ArrowLeft className="size-3" /> All SMM services
        </Link>

        <div className="mt-6 rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">{(svc as any).smm_categories?.name ?? svc.provider_category ?? "Service"}</p>
          <h1 className="mt-1 font-sora text-xl sm:text-2xl font-semibold text-white">{svc.name}</h1>
          {svc.description && <p className="mt-2 text-xs text-zinc-400 whitespace-pre-line">{svc.description}</p>}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Per 1,000" value={formatNaira(ngnPer1k * 100)} accent />
            <Stat label="Min order" value={svc.min_qty.toLocaleString()} />
            <Stat label="Max order" value={svc.max_qty.toLocaleString()} />
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Target link / username</span>
              <input
                value={link} onChange={(e) => setLink(e.target.value)}
                placeholder="https://instagram.com/yourprofile"
                className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Quantity</span>
              <input
                type="number" min={svc.min_qty} max={svc.max_qty}
                value={qty} onChange={(e) => setQty(e.target.value)}
                placeholder={`min ${svc.min_qty}`}
                className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
              />
            </label>

            <div className="flex items-center justify-between rounded-lg border border-vault-gold/20 bg-vault-gold/5 px-4 py-3">
              <span className="text-xs uppercase tracking-widest text-zinc-400">Total</span>
              <span className="font-sora text-xl text-vault-gold-light">{formatNaira(price)}</span>
            </div>

            <button
              onClick={submit}
              disabled={placing || !qtyNum || !link}
              className="w-full rounded-lg bg-vault-gold px-4 py-3 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light disabled:opacity-50"
            >
              {placing ? "Placing order…" : user ? "Place order" : "Sign in to order"}
            </button>
            <p className="text-center text-[10px] text-zinc-500">Charged from your NexaLogs wallet. Refunds are issued automatically for canceled or partial orders.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-vault-bg/60 p-3 ring-1 ring-white/5">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</p>
      <p className={`mt-1 font-sora text-base ${accent ? "text-vault-gold-light" : "text-white"}`}>{value}</p>
    </div>
  );
}
