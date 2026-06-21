import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    void navigate({ to: "/" });
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 chars");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) return toast.error(error.message);
    setPassword("");
    toast.success("Password updated");
  };

  return (
    <div className="min-h-screen bg-vault-bg text-zinc-300">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12 space-y-8">
        <header>
          <p className="text-xs uppercase tracking-widest text-zinc-500">Account</p>
          <h1 className="mt-1 font-sora text-3xl font-semibold text-white">Settings</h1>
        </header>

        <div className="rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5">
          <h2 className="font-sora text-base font-medium text-white">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <dt className="text-zinc-500">Email</dt>
              <dd className="text-zinc-100">{user?.email}</dd>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <dt className="text-zinc-500">User ID</dt>
              <dd className="font-mono text-[11px] text-zinc-400">{user?.id}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={changePassword} className="rounded-2xl bg-vault-surface p-6 ring-1 ring-white/5">
          <h2 className="font-sora text-base font-medium text-white">Change password</h2>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-xl border border-white/10 bg-vault-bg px-4 py-3 text-sm text-white outline-none focus:border-vault-gold/40"
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg hover:bg-vault-gold-light disabled:opacity-60"
          >
            Update password
          </button>
        </form>

        <button
          onClick={signOut}
          className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20"
        >
          Sign out
        </button>
      </main>
      <SiteFooter />
    </div>
  );
}
