import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    accent: "white",
    sort_order: 0,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      return data ?? [];
    },
  });

  const reset = () => {
    setForm({ name: "", slug: "", description: "", icon: "", accent: "white", sort_order: 0 });
    setAdding(false);
  };

  const create = async () => {
    if (!form.name || !form.slug) return toast.error("Name and slug required");
    const { error } = await supabase.from("categories").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Category created");
    reset();
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  const toggle = async (id: string, is_active: boolean) => {
    await supabase.from("categories").update({ is_active: !is_active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this category? Products inside will block deletion.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">Catalog</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Categories</h1>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light"
        >
          <Plus className="size-4" /> New category
        </button>
      </header>

      {adding && (
        <div className="relative rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20">
          <button onClick={reset} className="absolute right-4 top-4 text-zinc-500 hover:text-white">
            <X className="size-4" />
          </button>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v, slug: form.slug || slugify(v) })} />
            <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
            <Input label="Icon (1-3 chars)" value={form.icon} onChange={(v) => setForm({ ...form, icon: v })} />
            <Select label="Accent color" value={form.accent} onChange={(v) => setForm({ ...form, accent: v })} options={["white", "blue", "pink", "cyan", "amber", "red", "sky", "yellow"]} />
            <Input label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
            <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          </div>
          <button
            onClick={create}
            className="mt-5 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light"
          >
            Create category
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Sort</th>
              <th className="p-4">Active</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading…</td></tr>
            ) : (data ?? []).map((c) => (
              <tr key={c.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 text-zinc-100">{c.name}</td>
                <td className="p-4 font-mono text-xs text-zinc-400">{c.slug}</td>
                <td className="p-4 text-zinc-400">{c.sort_order}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggle(c.id, c.is_active)}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      c.is_active ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-zinc-700/40 text-zinc-400"
                    }`}
                  >
                    {c.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => del(c.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
