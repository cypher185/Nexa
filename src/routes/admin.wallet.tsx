import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira } from "@/lib/format";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/wallet")({
  component: TransactionsAdmin,
});

function TransactionsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "transactions"],
    queryFn: async () => {
      const { data: txs } = await supabase
        .from("wallet_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      const list = txs ?? [];
      if (list.length === 0) return [];
      const ids = Array.from(new Set(list.map((t: any) => t.user_id)));
      const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", ids);
      const emailMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.email]));
      return list.map((t: any) => ({ ...t, user_email: emailMap[t.user_id] ?? "—" }));
    },
  });

  const deleteOne = async (id: string) => {
    if (!confirm("Delete this transaction log? This cannot be undone.")) return;
    const { error } = await supabase.from("wallet_transactions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Log deleted");
    qc.invalidateQueries({ queryKey: ["admin", "transactions"] });
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Finance</p>
        <h1 className="mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white">Wallet transactions</h1>
      </header>

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Type</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-right">Status</th>
              <th className="p-4 text-right">When</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-zinc-500">No transactions.</td></tr>
            ) : data?.map((t: any) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 text-zinc-300">{t.user_email}</td>
                <td className="p-4 capitalize text-zinc-200">{t.type}</td>
                <td className="p-4 text-zinc-400 line-clamp-1 max-w-xs">{t.description ?? "—"}</td>
                <td className={`p-4 text-right font-medium tabular-nums ${t.amount_kobo >= 0 ? "text-emerald-400" : "text-zinc-100"}`}>
                  {t.amount_kobo >= 0 ? "+" : "−"}{formatNaira(Math.abs(t.amount_kobo))}
                </td>
                <td className="p-4 text-right">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    t.status === "success" ? "bg-emerald-500/10 text-emerald-400" :
                    t.status === "pending" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>{t.status}</span>
                </td>
                <td className="p-4 text-right text-[11px] text-zinc-500">{new Date(t.created_at).toLocaleString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteOne(t.id)}
                    className="text-red-400 hover:text-red-300"
                    aria-label="Delete log"
                  >
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
