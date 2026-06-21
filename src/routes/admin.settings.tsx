import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const qc = useQueryClient();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, any> = {};
      (data ?? []).forEach((r) => (map[r.key] = r.value));
      return map;
    },
  });

  const [supportEmail, setSupportEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
    if (data) {
      setSupportEmail(data.support_email?.value ?? "");
      setWhatsapp(data.support_whatsapp?.value ?? "");
    }
  }, [data]);

  const save = async () => {
    const rows = [
      { key: "support_email", value: { value: supportEmail }, updated_at: new Date().toISOString() },
      { key: "support_whatsapp", value: { value: whatsapp }, updated_at: new Date().toISOString() },
    ];
    const { error } = await supabase.from("site_settings").upsert(rows);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
  };

  const webhookUrl = `${origin}/api/public/webhooks/korapay`;

  const copyHook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-zinc-500">System</p>
        <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Settings</h1>
      </header>

      <section className="rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5">
        <h2 className="font-sora text-base font-medium text-white">Korapay configuration</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Add these env vars on your server. Don't put them in client code.
        </p>
        <ul className="mt-4 space-y-2 text-xs">
          {["KORAPAY_PUBLIC_KEY", "KORAPAY_SECRET_KEY", "KORAPAY_WEBHOOK_SECRET"].map((k) => (
            <li key={k} className="flex items-center justify-between rounded-lg bg-vault-bg px-3 py-2 ring-1 ring-white/5">
              <code className="font-mono text-vault-gold-light">{k}</code>
              <span className="text-zinc-500">required</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Webhook URL (paste into Korapay dashboard)</p>
          <div className="mt-1 flex items-center gap-2 rounded-lg bg-vault-bg px-3 py-2 ring-1 ring-white/5">
            <code className="flex-1 font-mono text-xs text-vault-gold-light line-clamp-1">{webhookUrl}</code>
            <button onClick={copyHook} className="text-vault-gold-light hover:text-white">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5">
        <h2 className="font-sora text-base font-medium text-white">Support contacts</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Support email</span>
            <input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" />
          </label>
          <label>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">WhatsApp number</span>
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" />
          </label>
        </div>
        <button onClick={save} className="mt-5 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light">Save</button>
      </section>

      <section className="rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5">
        <h2 className="font-sora text-base font-medium text-white">Bootstrap admin (first time)</h2>
        <p className="mt-2 text-xs text-zinc-500">After signing up, run this in the Supabase SQL editor to promote your account:</p>
        <pre className="mt-3 overflow-auto rounded-lg bg-vault-bg p-4 font-mono text-[11px] text-vault-gold-light ring-1 ring-white/5">
{`insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'YOUR@EMAIL.COM'
on conflict do nothing;`}
        </pre>
      </section>
    </div>
  );
}
