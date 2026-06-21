import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Package as PackageIcon, X, Layers } from "lucide-react";
import { formatNaira, nairaToKobo } from "@/lib/format";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [stockFor, setStockFor] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data: cats } = await supabase.from("categories").select("id, name").order("name");
      const { data: prods } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });

      // counts
      const counts: Record<string, number> = {};
      if (prods && prods.length > 0) {
        const ids = prods.map((p) => p.id);
        const { data: stockRows } = await supabase
          .from("account_stock")
          .select("product_id, status")
          .in("product_id", ids);
        (stockRows ?? []).forEach((s) => {
          if (s.status === "available") counts[s.product_id] = (counts[s.product_id] ?? 0) + 1;
        });
      }

      return { cats: cats ?? [], prods: prods ?? [], counts };
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">Catalog</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Products</h1>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light"
        >
          <Plus className="size-4" /> New product
        </button>
      </header>

      {adding && (
        <ProductForm
          categories={data?.cats ?? []}
          onClose={() => setAdding(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin", "products"] });
            setAdding(false);
          }}
        />
      )}

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-right">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {(data?.prods ?? []).length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No products yet.</td></tr>
            ) : data?.prods.map((p: any) => (
              <tr key={p.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 text-zinc-100">{p.title}</td>
                <td className="p-4 text-zinc-400">{p.categories?.name ?? "—"}</td>
                <td className="p-4 text-right font-medium text-white">{formatNaira(p.price_kobo)}</td>
                <td className="p-4 text-right">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    (data.counts[p.id] ?? 0) === 0 ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {data.counts[p.id] ?? 0} avail
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => setStockFor(p.id)}
                    className="text-vault-gold-light hover:underline text-xs"
                  >
                    <Layers className="inline size-3.5" /> stock
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this product? All unsold stock will be removed too.")) return;
                      const { error } = await supabase.from("products").delete().eq("id", p.id);
                      if (error) return toast.error(error.message);
                      qc.invalidateQueries({ queryKey: ["admin", "products"] });
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stockFor && (
        <StockManager
          productId={stockFor}
          onClose={() => {
            setStockFor(null);
            qc.invalidateQueries({ queryKey: ["admin", "products"] });
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ categories, onClose, onSaved }: { categories: any[]; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceNaira, setPriceNaira] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [metadataText, setMetadataText] = useState('{\n  "age": "2018",\n  "location": "Nigeria"\n}');

  const save = async () => {
    if (!title || !priceNaira || !categoryId) return toast.error("Fill all required fields");
    let metadata: any = {};
    try { metadata = JSON.parse(metadataText); } catch { return toast.error("Metadata is not valid JSON"); }
    const { error } = await supabase.from("products").insert({
      title,
      description,
      price_kobo: nairaToKobo(priceNaira),
      category_id: categoryId,
      metadata,
      source: "internal",
    });
    if (error) return toast.error(error.message);
    toast.success("Product created");
    onSaved();
  };

  return (
    <div className="relative rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20">
      <button onClick={onClose} className="absolute right-4 top-4 text-zinc-500 hover:text-white">
        <X className="size-4" />
      </button>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Title</span>
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Category</span>
          <select className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Price (₦)</span>
          <input type="number" className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" value={priceNaira} onChange={(e) => setPriceNaira(e.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Description</span>
          <textarea rows={3} className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Metadata (JSON — shown on product page)</span>
          <textarea rows={6} className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 font-mono text-xs text-white outline-none focus:border-vault-gold/40" value={metadataText} onChange={(e) => setMetadataText(e.target.value)} />
        </label>
      </div>
      <button onClick={save} className="mt-5 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light">
        Save product
      </button>
    </div>
  );
}

function StockManager({ productId, onClose }: { productId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [bulk, setBulk] = useState("");
  const { data } = useQuery({
    queryKey: ["admin", "stock", productId],
    queryFn: async () => {
      const { data } = await supabase
        .from("account_stock")
        .select("id, status, credentials, sold_at, created_at")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const addBulk = async () => {
    const lines = bulk.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return toast.error("Paste at least one line");
    const rows = lines.map((credentials) => ({ product_id: productId, credentials }));
    const { error } = await supabase.from("account_stock").insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`${lines.length} account(s) added to stock`);
    setBulk("");
    qc.invalidateQueries({ queryKey: ["admin", "stock", productId] });
  };

  const removeStock = async (id: string) => {
    if (!confirm("Remove this stock item?")) return;
    await supabase.from("account_stock").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "stock", productId] });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-3xl max-h-[85vh] overflow-auto rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20">
        <div className="flex items-center justify-between">
          <h3 className="font-sora text-lg font-semibold text-white">
            <PackageIcon className="inline size-4 mr-1" /> Stock manager
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="size-5" /></button>
        </div>

        <div className="mt-6">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500">
            Bulk add — one credential per line (e.g. email:password:recovery)
          </label>
          <textarea
            rows={5}
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder="user1@gmail.com:Pass1234:recovery1@x.com&#10;user2@gmail.com:Pass5678:recovery2@x.com"
            className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 font-mono text-xs text-white outline-none focus:border-vault-gold/40"
          />
          <button onClick={addBulk} className="mt-3 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light">
            Add to stock
          </button>
        </div>

        <div className="mt-8">
          <h4 className="font-sora text-sm font-medium text-zinc-300">Existing stock ({data?.length ?? 0})</h4>
          <div className="mt-3 max-h-80 overflow-auto rounded-xl ring-1 ring-white/5">
            <table className="w-full text-xs">
              <tbody>
                {(data ?? []).length === 0 ? (
                  <tr><td className="p-6 text-center text-zinc-500">No stock yet.</td></tr>
                ) : data?.map((s: any) => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0">
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        s.status === "available" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-700/40 text-zinc-400"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-zinc-400 line-clamp-1 max-w-md">
                      {s.credentials.slice(0, 60)}{s.credentials.length > 60 ? "…" : ""}
                    </td>
                    <td className="p-3 text-right">
                      {s.status !== "sold" && (
                        <button onClick={() => removeStock(s.id)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
