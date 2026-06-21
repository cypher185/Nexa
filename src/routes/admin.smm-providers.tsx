import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X, RefreshCw, Wifi } from "lucide-react";

export const Route = createFileRoute("/admin/smm-providers")({
  component: SmmProvidersAdmin,
});

async function authedFetch(path: string, body: any) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json } as const;
}

function SmmProvidersAdmin() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", api_url: "", api_key: "" });
  const [syncing, setSyncing] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "smm-providers"],
    queryFn: async () => {
      const { data } = await supabase.from("smm_providers").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = async () => {
    if (!form.name || !form.api_url || !form.api_key) return toast.error("All fields required");
    const { error } = await supabase.from("smm_providers").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Provider added");
    setAdding(false);
    setForm({ name: "", api_url: "", api_key: "" });
    qc.invalidateQueries({ queryKey: ["admin", "smm-providers"] });
  };

  const test = async () => {
    if (!form.api_url || !form.api_key) return toast.error("URL & key required");
    setTesting(true);
    const r = await authedFetch("/api/smm/admin/test", { api_url: form.api_url, api_key: form.api_key });
    setTesting(false);
    if (!r.ok) return toast.error(r.json.error ?? "Test failed");
    const bal = r.json.balance ? `${r.json.balance.balance} ${r.json.balance.currency}` : "unknown";
    toast.success(
      `Connected — balance ${bal} · ${r.json.services_count ?? 0} services across ${r.json.categories_count ?? 0} categories`,
    );
  };

  const toggle = async (id: string, enabled: boolean) => {
    await supabase.from("smm_providers").update({ enabled: !enabled }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "smm-providers"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this provider and all its services?")) return;
    const { error } = await supabase.from("smm_providers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "smm-providers"] });
  };

  const sync = async (id: string) => {
    setSyncing(id);
    const r = await authedFetch("/api/smm/admin/sync", { provider_id: id });
    setSyncing(null);
    if (!r.ok) return toast.error(r.json.error ?? "Sync failed");
    toast.success(`Synced ${r.json.services_synced} services`);
    qc.invalidateQueries({ queryKey: ["admin", "smm-providers"] });
    qc.invalidateQueries({ queryKey: ["admin", "smm-services"] });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">SMM</p>
          <h1 className="mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white">SMM Providers</h1>
          <p className="mt-1 max-w-2xl text-xs text-zinc-500">
            Add upstream SMM panels (JustAnotherPanel, Peakerr, etc.). After adding, click <strong>Sync</strong> to pull their services.
          </p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light">
          <Plus className="size-4" /> Add provider
        </button>
      </header>

      {adding && (
        <div className="relative rounded-2xl bg-vault-surface p-4 sm:p-6 ring-1 ring-vault-gold/20">
          <button onClick={() => setAdding(false)} className="absolute right-4 top-4 text-zinc-500 hover:text-white"><X className="size-4" /></button>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Peakerr" />
            <Field label="API URL" value={form.api_url} onChange={(v) => setForm({ ...form, api_url: v })} placeholder="https://peakerr.com/api/v2" />
            <Field label="API key" value={form.api_key} onChange={(v) => setForm({ ...form, api_key: v })} className="md:col-span-2" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={test} disabled={testing} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50">
              <Wifi className="size-3.5" /> {testing ? "Testing…" : "Test connection"}
            </button>
            <button onClick={create} className="rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light">Save provider</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4">Name</th><th className="p-4">URL</th><th className="p-4 text-right">Balance</th>
              <th className="p-4 text-center">Active</th><th className="p-4">Last sync</th><th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No providers yet.</td></tr>
            ) : data?.map((p: any) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 text-white">{p.name}</td>
                <td className="p-4 text-xs text-zinc-400 truncate max-w-xs">{p.api_url}</td>
                <td className="p-4 text-right tabular-nums text-zinc-200">{p.balance_usd != null ? `${p.balance_usd} ${p.currency}` : "—"}</td>
                <td className="p-4 text-center">
                  <button onClick={() => toggle(p.id, p.enabled)} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.enabled ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`}>
                    {p.enabled ? "Active" : "Disabled"}
                  </button>
                </td>
                <td className="p-4 text-[11px] text-zinc-500">{p.last_synced_at ? new Date(p.last_synced_at).toLocaleString() : "Never"}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => sync(p.id)} disabled={syncing === p.id} className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50">
                      <RefreshCw className={`size-3 ${syncing === p.id ? "animate-spin" : ""}`} /> Sync
                    </button>
                    <button onClick={() => del(p.id)} className="text-red-400 hover:text-red-300" aria-label="Delete provider">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={className}>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" />
    </label>
  );
}
