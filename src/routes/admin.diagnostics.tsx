import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, CheckCircle2, AlertCircle, Database, Wifi, WifiOff } from "lucide-react";

export const Route = createFileRoute("/admin/diagnostics")({
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  const { data: diag, isLoading } = useQuery({
    queryKey: ["admin", "diagnostics"],
    queryFn: async () => {
      const results: Record<string, any> = {};
      const checks = [
        { key: "orders", label: "Orders", fn: () => supabase.from("orders").select("*", { count: "exact", head: true }) },
        { key: "wallet_transactions", label: "Wallet Transactions", fn: () => supabase.from("wallet_transactions").select("*", { count: "exact", head: true }) },
        { key: "smm_orders", label: "SMM Orders", fn: () => supabase.from("smm_orders").select("*", { count: "exact", head: true }) },
        { key: "smm_services", label: "SMM Services", fn: () => supabase.from("smm_services").select("*", { count: "exact", head: true }) },
        { key: "smm_providers", label: "SMM Providers", fn: () => supabase.from("smm_providers").select("*", { count: "exact", head: true }) },
        { key: "products", label: "Products", fn: () => supabase.from("products").select("*", { count: "exact", head: true }) },
        { key: "profiles", label: "Users", fn: () => supabase.from("profiles").select("*", { count: "exact", head: true }) },
        { key: "smm_poll_log", label: "SMM Poll Log", fn: () => supabase.from("smm_poll_log").select("*", { count: "exact", head: true }) },
      ];

      for (const c of checks) {
        const start = performance.now();
        const { count, error } = await c.fn();
        const ms = Math.round(performance.now() - start);
        results[c.key] = {
          label: c.label,
          ok: !error,
          count: count ?? 0,
          error: error?.message ?? null,
          ms,
        };
      }

      // Last poll log entry
      const { data: lastPoll } = await supabase
        .from("smm_poll_log")
        .select("ok, errors, started_at, finished_at")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Last failed poll
      const { data: lastFailed } = await supabase
        .from("smm_poll_log")
        .select("errors, started_at")
        .eq("ok", false)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        checks: results,
        lastPoll: lastPoll ?? null,
        lastFailedPoll: lastFailed ?? null,
      };
    },
  });

  const allOk = diag ? Object.values(diag.checks).every((c: any) => c.ok) : false;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Admin</p>
        <h1 className="mt-1 font-sora text-2xl sm:text-3xl font-semibold text-white">Diagnostics</h1>
        <p className="mt-1 max-w-2xl text-xs text-zinc-500">
          Health checks for all database queries and the last SMM API poll status.
        </p>
      </header>

      <div className="rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5">
        <div className="flex items-center gap-3">
          {allOk ? (
            <CheckCircle2 className="size-5 text-emerald-400" />
          ) : (
            <AlertCircle className="size-5 text-amber-400" />
          )}
          <div>
            <p className="text-sm font-semibold text-white">
              {allOk ? "All systems healthy" : "Some checks failed"}
            </p>
            <p className="text-xs text-zinc-500">
              {isLoading ? "Running checks…" : `${Object.values(diag?.checks ?? {}).filter((c: any) => c.ok).length} / ${Object.keys(diag?.checks ?? {}).length} passing`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(isLoading ? Array.from({ length: 8 }) : Object.entries(diag?.checks ?? {})).map((item, i) => {
          if (isLoading) {
            return (
              <div key={i} className="rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5 animate-pulse">
                <div className="h-4 w-24 rounded bg-zinc-700" />
                <div className="mt-2 h-6 w-12 rounded bg-zinc-700" />
              </div>
            );
          }
          const [key, c] = item as [string, any];
          return (
            <div key={key} className={`rounded-2xl bg-vault-surface p-4 ring-1 ${c.ok ? "ring-white/5" : "ring-red-500/20"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-zinc-500" />
                  <span className="text-xs text-zinc-400">{c.label}</span>
                </div>
                {c.ok ? (
                  <CheckCircle2 className="size-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="size-4 text-red-400" />
                )}
              </div>
              <p className="mt-2 font-sora text-xl text-white tabular-nums">{c.count.toLocaleString()}</p>
              <p className="text-[11px] text-zinc-500">{c.ms} ms</p>
              {c.error && (
                <p className="mt-2 text-[11px] text-red-400 break-all">{c.error}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-vault-surface p-4 ring-1 ring-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-vault-gold" />
          <h2 className="text-sm font-semibold text-white">SMM API Poll Status</h2>
        </div>

        {diag?.lastPoll ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-vault-bg/40 p-3">
              {diag.lastPoll.ok ? (
                <Wifi className="size-4 text-emerald-400" />
              ) : (
                <WifiOff className="size-4 text-red-400" />
              )}
              <div>
                <p className="text-xs text-zinc-400">Last poll</p>
                <p className={`text-sm font-semibold ${diag.lastPoll.ok ? "text-emerald-400" : "text-red-400"}`}>
                  {diag.lastPoll.ok ? "Successful" : "Failed"}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {new Date(diag.lastPoll.started_at).toLocaleString()}
                </p>
              </div>
            </div>

            {diag.lastFailedPoll && (
              <div className="rounded-lg bg-vault-bg/40 p-3">
                <p className="text-xs text-zinc-400">Last failure</p>
                <p className="text-sm font-semibold text-red-400">{new Date(diag.lastFailedPoll.started_at).toLocaleString()}</p>
                {diag.lastFailedPoll.errors && (
                  <pre className="mt-2 text-[11px] text-red-300 break-all whitespace-pre-wrap">
                    {JSON.stringify(diag.lastFailedPoll.errors, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {!diag.lastFailedPoll && (
              <div className="rounded-lg bg-vault-bg/40 p-3">
                <p className="text-xs text-zinc-400">Last failure</p>
                <p className="text-sm text-emerald-400">No failed polls recorded</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
            No poll log entries yet. The SMM auto-poll cron job may not be configured.
          </div>
        )}
      </div>
    </div>
  );
}
