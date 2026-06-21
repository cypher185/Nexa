import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/providers")({
  component: ProvidersAdmin,
});

function ProvidersAdmin() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", base_url: "", api_key_secret_name: "", config: "{}" });

  const { data } = useQuery({
    queryKey: ["admin", "providers"],
    queryFn: async () => {
      const { data } = await supabase.from("external_providers").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = async () => {
    if (!form.name || !form.slug) return toast.error("Name and slug required");
    let config: any = {};
    try { config = JSON.parse(form.config); } catch { return toast.error("Config must be valid JSON"); }
    const { error } = await supabase.from("external_providers").insert({
      name: form.name, slug: form.slug, base_url: form.base_url || null,
      api_key_secret_name: form.api_key_secret_name || null, config,
    });
    if (error) return toast.error(error.message);
    toast.success("Provider added");
    setAdding(false);
    setForm({ name: "", slug: "", base_url: "", api_key_secret_name: "", config: "{}" });
    qc.invalidateQueries({ queryKey: ["admin", "providers"] });
  };

  const toggle = async (id: string, is_active: boolean) => {
    await supabase.from("external_providers").update({ is_active: !is_active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "providers"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this provider?")) return;
    const { error } = await supabase.from("external_providers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "providers"] });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">Integrations</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">External providers</h1>
          <p className="mt-1 max-w-2xl text-xs text-zinc-500">
            Plug in any reseller API. Store the API key as an env-secret on your server and reference its
            name here. Sync runs at <code className="text-vault-gold-light">/api/public/providers/sync</code>.
          </p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light">
          <Plus className="size-4" /> Add provider
        </button>
      </header>

      {adding && (
        <div className="relative rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20">
          <button onClick={() => setAdding(false)} className="absolute right-4 top-4 text-zinc-500 hover:text-white"><X className="size-4" /></button>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v, slug: form.slug || v.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} />
            <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} helper="URL-safe identifier (e.g. peakerr, smmstone)" />
            <Field label="Base URL" value={form.base_url} onChange={(v) => setForm({ ...form, base_url: v })} placeholder="https://peakerr.com/api/v2" />
            <Field label="API key secret name (env var)" value={form.api_key_secret_name} onChange={(v) => setForm({ ...form, api_key_secret_name: v })} placeholder="PROVIDER_API_KEY" />
            <label className="md:col-span-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Config (JSON)</span>
              <p className="text-[11px] text-zinc-500 mb-1">Extra settings for this provider. Leave as <code className="text-vault-gold-light">{}</code> if not needed.</p>
              <textarea rows={4} className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 font-mono text-xs text-white outline-none focus:border-vault-gold/40" value={form.config} onChange={(e) => setForm({ ...form, config: e.target.value })} />
            </label>
          </div>
          <button onClick={create} className="mt-5 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light">Add provider</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Base URL</th>
              <th className="p-4">Secret</th>
              <th className="p-4">Active</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No providers yet.</td></tr>
            ) : data?.map((p) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 text-zinc-100">{p.name}</td>
                <td className="p-4 font-mono text-xs text-zinc-400">{p.slug}</td>
                <td className="p-4 font-mono text-xs text-zinc-400 max-w-xs line-clamp-1">{p.base_url ?? "—"}</td>
                <td className="p-4 font-mono text-xs text-vault-gold-light">{p.api_key_secret_name ?? "—"}</td>
                <td className="p-4">
                  <button onClick={() => toggle(p.id, p.is_active)} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"}`}>
                    {p.is_active ? "Active" : "Off"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => del(p.id)} className="text-red-400"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, helper }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; helper?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      {helper && <p className="text-[11px] text-zinc-500">{helper}</p>}
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" />
    </label>
  );
}
