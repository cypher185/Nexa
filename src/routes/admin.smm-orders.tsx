import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, RefreshCw } from "lucide-react";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/admin/smm-orders")({
  component: SmmOrdersAdmin,
});

async function authedFetch(path: string, body: any) {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
    body: JSON.stringify(body),
  });
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  in_progress: "bg-sky-500/10 text-sky-400",
  completed: "bg-emerald-500/10 text-emerald-400",
  partial: "bg-orange-500/10 text-orange-400",
  canceled: "bg-zinc-500/10 text-zinc-400",
  refunded: "bg-zinc-500/10 text-zinc-400",
  failed: "bg-red-500/10 text-red-400",
};

function SmmOrdersAdmin() {
  const qc = useQueryClient();
  const [polling, setPolling] = useState(false);
  const [cronBusy, setCronBusy] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "smm-orders"],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from("smm_orders")
        .select("*, smm_services(name)")
        .order("created_at", { ascending: false })
        .limit(500);
      const list = orders ?? [];
      if (list.length === 0) return [];
      const ids = Array.from(new Set(list.map((o: any) => o.user_id)));
      const { data: profiles } = await supabase.from("profiles").select("id, email").in("id", ids);
      const emailMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.email]));
      return list.map((o: any) => ({ ...o, user_email: emailMap[o.user_id] ?? "—" }));
    },
  });

  const { data: cronJob, refetch: refetchCron } = useQuery({
    queryKey: ["admin", "smm-cron"],
    queryFn: async () => {
      const r = await authedFetch("/api/smm/admin/cron", { action: "status" });
      const j = await r.json().catch(() => ({}));
      return j.job ?? null;
    },
  });

  const del = async (id: string) => {
    if (!confirm("Delete this order log?")) return;
    const { error } = await supabase.from("smm_orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "smm-orders"] });
  };

  const refresh = async () => {
    setPolling(true);
    const r = await authedFetch("/api/public/smm/poll", {});
    setPolling(false);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return toast.error(j.error ?? "Poll failed");
    toast.success(`Refreshed ${j.updated ?? 0} of ${j.checked ?? 0} orders`);
    qc.invalidateQueries({ queryKey: ["admin", "smm-orders"] });
  };

  const toggleCron = async () => {
    setCronBusy(true);
    const action = cronJob ? "disable" : "enable";
    const r = await authedFetch("/api/smm/admin/cron", { action, every_minutes: 2 });
    setCronBusy(false);
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return toast.error(j.error ?? "Cron update failed");
    toast.success(action === "enable" ? "Auto-poll enabled (every 2 min)" : "Auto-poll disabled");
    refetchCron();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">SMM</p>
          <h1 className="mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white">SMM Orders</h1>
          <p className="mt-1 text-xs text-zinc-500">
            Auto-poll: <span className={cronJob ? "text-emerald-400" : "text-zinc-400"}>{cronJob ? `on (${cronJob.schedule})` : "off"}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleCron} disabled={cronBusy} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50">
            {cronJob ? "Disable auto-poll" : "Enable auto-poll"}
          </button>
          <button onClick={refresh} disabled={polling} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50">
            <RefreshCw className={`size-3.5 ${polling ? "animate-spin" : ""}`} /> Refresh statuses
          </button>
        </div>
      </header>


      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">User</th>
              <th className="p-3">Service</th>
              <th className="p-3">Link</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Charge</th>
              <th className="p-3 text-right">Refund</th>
              <th className="p-3 text-right">Remains</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={10} className="p-8 text-center text-zinc-500">No orders yet.</td></tr>
            ) : data?.map((o: any) => (
              <tr key={o.id} className="border-b border-white/5 last:border-0">
                <td className="p-3 text-[11px] text-zinc-500">{new Date(o.created_at).toLocaleString()}</td>
                <td className="p-3 text-xs text-zinc-300">{o.user_email}</td>
                <td className="p-3 text-xs text-zinc-200">{o.smm_services?.name ?? "—"}</td>
                <td className="p-3 text-xs text-zinc-400 max-w-[180px] truncate"><a href={o.link} target="_blank" rel="noreferrer" className="hover:text-vault-gold-light">{o.link}</a></td>
                <td className="p-3 text-right tabular-nums text-zinc-300">{o.quantity.toLocaleString()}</td>
                <td className="p-3 text-right tabular-nums text-zinc-100">{formatNaira(o.charge_kobo)}</td>
                <td className="p-3 text-right tabular-nums text-emerald-400">{o.refund_kobo ? formatNaira(o.refund_kobo) : "—"}</td>
                <td className="p-3 text-right tabular-nums text-zinc-400">{o.remains ?? "—"}</td>
                <td className="p-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[o.status] ?? "bg-zinc-500/10 text-zinc-400"}`}>
                    {o.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => del(o.id)} className="text-red-400 hover:text-red-300" aria-label="Delete order log">
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
