import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira, nairaToKobo } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";
import { Shield, ShieldOff, Wallet as WalletIcon } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: UsersAdmin,
});

function UsersAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["admin", "users", search],
    queryFn: async () => {
      let q = supabase
        .from("profiles")
        .select("id, email, full_name, is_banned, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (search) q = q.ilike("email", `%${search}%`);
      const { data: profiles } = await q;
      const ids = (profiles ?? []).map((p) => p.id);
      if (ids.length === 0) return [];
      const [{ data: wallets }, { data: roles }] = await Promise.all([
        supabase.from("wallets").select("user_id, balance_kobo").in("user_id", ids),
        supabase.from("user_roles").select("user_id, role").in("user_id", ids),
      ]);
      const w = Object.fromEntries((wallets ?? []).map((x) => [x.user_id, x.balance_kobo]));
      const rByUser: Record<string, string[]> = {};
      (roles ?? []).forEach((r) => {
        rByUser[r.user_id] ??= [];
        rByUser[r.user_id].push(r.role);
      });
      return (profiles ?? []).map((p) => ({
        ...p,
        balance: w[p.id] ?? 0,
        isAdmin: (rByUser[p.id] ?? []).includes("admin"),
      }));
    },
  });

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      if (!confirm("Revoke admin?")) return;
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      toast.success("Admin revoked");
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      toast.success("Granted admin");
    }
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const toggleBan = async (userId: string, isBanned: boolean) => {
    await supabase.from("profiles").update({ is_banned: !isBanned }).eq("id", userId);
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500">People</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Users</h1>
        </div>
        <input
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-lg border border-white/10 bg-vault-surface px-3 py-2 text-sm text-white outline-none focus:border-vault-gold/40"
        />
      </header>

      <div className="overflow-x-auto rounded-2xl bg-vault-surface ring-1 ring-white/5">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-white/5 text-left text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Name</th>
              <th className="p-4 text-right">Balance</th>
              <th className="p-4 text-right">Role</th>
              <th className="p-4 text-right">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No users.</td></tr>
            ) : data?.map((u: any) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 text-zinc-100">{u.email}</td>
                <td className="p-4 text-zinc-400">{u.full_name ?? "—"}</td>
                <td className="p-4 text-right font-medium text-white tabular-nums">{formatNaira(u.balance)}</td>
                <td className="p-4 text-right">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.isAdmin ? "bg-vault-gold/10 text-vault-gold-light" : "bg-zinc-700/40 text-zinc-400"}`}>
                    {u.isAdmin ? "admin" : "user"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.is_banned ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                    {u.is_banned ? "banned" : "active"}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setAdjusting(u.id)} className="text-vault-gold-light text-xs hover:underline">
                    <WalletIcon className="inline size-3.5" />
                  </button>
                  <button onClick={() => toggleAdmin(u.id, u.isAdmin)} className="text-vault-gold-light hover:underline">
                    {u.isAdmin ? <ShieldOff className="inline size-3.5" /> : <Shield className="inline size-3.5" />}
                  </button>
                  <button onClick={() => toggleBan(u.id, u.is_banned)} className="text-xs text-red-400 hover:underline">
                    {u.is_banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adjusting && <AdjustModal userId={adjusting} onClose={() => { setAdjusting(null); qc.invalidateQueries({ queryKey: ["admin", "users"] }); }} />}
    </div>
  );
}

function AdjustModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"credit" | "debit">("credit");

  const submit = async () => {
    const naira = Number(amount);
    if (!Number.isFinite(naira) || naira <= 0) return toast.error("Enter a positive amount");
    const kobo = nairaToKobo(naira) * (type === "credit" ? 1 : -1);

    // fetch current balance, update wallet, insert transaction
    const { data: wallet } = await supabase.from("wallets").select("balance_kobo").eq("user_id", userId).maybeSingle();
    const newBalance = (wallet?.balance_kobo ?? 0) + kobo;
    if (newBalance < 0) return toast.error("Would result in negative balance");

    const upd = await supabase.from("wallets").upsert({ user_id: userId, balance_kobo: newBalance, updated_at: new Date().toISOString() });
    if (upd.error) return toast.error(upd.error.message);
    const tx = await supabase.from("wallet_transactions").insert({
      user_id: userId,
      type: "adjust",
      status: "success",
      amount_kobo: kobo,
      balance_after_kobo: newBalance,
      description: reason || `Manual ${type} by admin`,
    });
    if (tx.error) return toast.error(tx.error.message);
    toast.success("Adjusted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-vault-surface p-6 ring-1 ring-vault-gold/20">
        <h3 className="font-sora text-lg font-semibold text-white">Adjust wallet</h3>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => setType("credit")} className={`rounded-lg px-3 py-2 text-sm font-medium ${type === "credit" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-zinc-400"}`}>Credit</button>
          <button onClick={() => setType("debit")} className={`rounded-lg px-3 py-2 text-sm font-medium ${type === "debit" ? "bg-red-500/10 text-red-400" : "bg-white/5 text-zinc-400"}`}>Debit</button>
        </div>
        <label className="mt-4 block">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Amount (₦)</span>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none" />
        </label>
        <label className="mt-3 block">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Reason</span>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Refund for order #..." className="mt-1 w-full rounded-lg border border-white/10 bg-vault-bg px-3 py-2 text-sm text-white outline-none" />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">Cancel</button>
          <button onClick={submit} className="rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light">Apply</button>
        </div>
      </div>
    </div>
  );
}
