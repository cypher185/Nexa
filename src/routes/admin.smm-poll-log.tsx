import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/smm-poll-log")({
  component: SmmPollLog,
});

function SmmPollLog() {
  const qc = useQueryClient();
  const [running, setRunning] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { data: polls } = useQuery({
    queryKey: ["admin", "smm-poll-log"],
    queryFn: async () => {
      const { data } = await supabase
        .from("smm_poll_log")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
    refetchInterval: 15000,
  });

  const { data: events } = useQuery({
    queryKey: ["admin", "smm-order-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("smm_order_events")
        .select("*, smm_orders(link, quantity, service_id)")
        .order("created_at", { ascending: false })
        .limit(100);
      return data ?? [];
    },
    refetchInterval: 15000,
  });

  const runNow = async () => {
    setRunning(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const r = await fetch("/api/public/smm/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: "{}",
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) return toast.error(json.error ?? "Poll failed");
      toast.success(`Polled ${json.checked ?? 0} · updated ${json.updated ?? 0}`);
      qc.invalidateQueries({ queryKey: ["admin", "smm-poll-log"] });
      qc.invalidateQueries({ queryKey: ["admin", "smm-order-events"] });
    } finally {
      setRunning(false);
    }
  };

  const grouped = new Map<string, typeof events>();
  for (const e of events ?? []) {
    const k = e.order_id ?? "_global";
    const arr = grouped.get(k) ?? [];
    arr.push(e as any);
    grouped.set(k, arr);
  }

  const lastPoll = polls?.[0];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">SMM</p>
          <h1 className="mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white">Poll log</h1>
          <p className="mt-1 max-w-2xl text-xs text-zinc-500">
            Last poll: {lastPoll ? new Date(lastPoll.started_at).toLocaleString() : "never"} ·{" "}
            {lastPoll?.ok ? "ok" : lastPoll ? "with errors" : "—"}
          </p>
        </div>
        <button
          onClick={runNow}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${running ? "animate-spin" : ""}`} /> Poll now
        </button>
      </header>

      <section>
        <h2 className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">Recent polls</h2>
        <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="p-3">Started</th>
                <th className="p-3">Source</th>
                <th className="p-3 text-right">Checked</th>
                <th className="p-3 text-right">Updated</th>
                <th className="p-3 text-right">Duration</th>
                <th className="p-3">Status</th>
                <th className="p-3">Errors</th>
              </tr>
            </thead>
            <tbody>
              {(polls ?? []).length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-zinc-500">No polls yet.</td></tr>
              ) : polls?.map((p: any) => {
                const dur = p.finished_at ? Math.round((new Date(p.finished_at).getTime() - new Date(p.started_at).getTime()) / 100) / 10 : null;
                return (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 align-top">
                    <td className="p-3 text-[11px] text-zinc-300">{new Date(p.started_at).toLocaleString()}</td>
                    <td className="p-3 text-[11px] text-zinc-400">{p.source ?? "—"}</td>
                    <td className="p-3 text-right tabular-nums text-zinc-200">{p.checked}</td>
                    <td className="p-3 text-right tabular-nums text-zinc-200">{p.updated}</td>
                    <td className="p-3 text-right text-[11px] text-zinc-500">{dur != null ? `${dur}s` : <Clock className="ml-auto size-3" />}</td>
                    <td className="p-3">
                      {p.ok ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]"><CheckCircle2 className="size-3" /> ok</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 text-[11px]"><AlertCircle className="size-3" /> errors</span>
                      )}
                    </td>
                    <td className="p-3 text-[11px] text-red-300/80 max-w-md">
                      {p.errors ? (
                        <pre className="whitespace-pre-wrap break-words">{Array.isArray(p.errors) ? p.errors.join("\n") : JSON.stringify(p.errors)}</pre>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-[11px] uppercase tracking-widest text-zinc-500">Recent order status changes</h2>
        <div className="rounded-2xl bg-vault-surface ring-1 ring-white/5 divide-y divide-white/5">
          {grouped.size === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">No order events yet.</div>
          ) : (
            [...grouped.entries()].map(([orderId, evtsMaybe]) => {
              const evts = evtsMaybe ?? [];
              if (evts.length === 0) return null;
              const isOpen = expandedOrder === orderId;
              const latest: any = evts[0];
              return (
                <div key={orderId} className="p-3">
                  <button
                    onClick={() => setExpandedOrder(isOpen ? null : orderId)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-zinc-300 font-mono truncate">{orderId.slice(0, 8)}</div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {latest.smm_orders?.link ?? "—"} · qty {latest.smm_orders?.quantity ?? "—"}
                      </div>
                    </div>
                    <div className="text-[11px] text-zinc-400 shrink-0">{evts.length} event{evts.length === 1 ? "" : "s"}</div>
                  </button>
                  {isOpen && (
                    <ol className="mt-3 space-y-1 border-l border-white/10 pl-3 text-[11px] text-zinc-400">
                      {evts.map((e: any) => (
                        <li key={e.id} className="flex flex-wrap items-baseline gap-2">
                          <span className="text-zinc-500">{new Date(e.created_at).toLocaleString()}</span>
                          {e.old_status && e.new_status ? (
                            <span className="text-zinc-200">{e.old_status} → <strong className="text-vault-gold">{e.new_status}</strong></span>
                          ) : null}
                          {e.remains != null && <span className="text-zinc-500">remains {e.remains}</span>}
                          {e.start_count != null && <span className="text-zinc-500">start {e.start_count}</span>}
                          {e.note && <span className="text-red-300/80">{e.note}</span>}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
