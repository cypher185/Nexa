import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatNairaDecimal } from "@/lib/format";
import { Menu, X, LogOut } from "lucide-react";

export function SiteHeader() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user || isAdmin) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    const fetchBalance = async () => {
      const { data } = await supabase
        .from("wallets")
        .select("balance_kobo")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) setBalance(data?.balance_kobo ?? 0);
    };
    void fetchBalance();
    const interval = setInterval(fetchBalance, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user, isAdmin]);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    void navigate({ to: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-vault-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" className="shrink-0 font-sora text-lg sm:text-xl font-semibold tracking-tight text-vault-gold-light">
            NexaLogs
          </Link>
          <div className="hidden gap-6 text-sm font-medium md:flex">
            <Link to="/browse" className="text-zinc-400 transition-colors hover:text-vault-gold-light">
              Marketplace
            </Link>
            <Link to="/smm" className="text-zinc-400 transition-colors hover:text-vault-gold-light">
              SMM
            </Link>
            {user && !isAdmin && (
              <Link to="/purchases" className="text-zinc-400 transition-colors hover:text-vault-gold-light">
                My Accounts
              </Link>
            )}
            {user && !isAdmin && (
              <Link to="/smm-orders" className="text-zinc-400 transition-colors hover:text-vault-gold-light">
                SMM Orders
              </Link>
            )}
            {user && !isAdmin && (
              <Link to="/wallet" className="text-zinc-400 transition-colors hover:text-vault-gold-light">
                Wallet
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-vault-gold transition-colors hover:text-vault-gold-light">
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {!isAdmin && (
                <>
                  <Link
                    to="/fund"
                    className="flex items-center gap-2 rounded-full border border-vault-gold/20 bg-vault-gold/5 py-1.5 pr-4 pl-2 ring-1 ring-vault-gold/10 transition-colors hover:bg-vault-gold/10"
                  >
                    <div className="size-2 animate-pulse rounded-full bg-vault-gold" />
                    <span className="font-sora text-xs font-medium tracking-wide text-vault-gold-light uppercase">
                      Balance
                    </span>
                    <span className="text-sm font-semibold text-white tabular-nums">
                      {balance === null ? "—" : formatNairaDecimal(balance)}
                    </span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="grid size-9 place-items-center rounded-full bg-zinc-800 ring-1 ring-white/10 text-xs font-semibold text-vault-gold-light uppercase"
                    aria-label="Dashboard"
                  >
                    {user.email?.[0] ?? "U"}
                  </Link>
                </>
              )}
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="size-3.5" /> Sign out
              </button>
            </>
          ) : !loading ? (
            <>
              <Link
                to="/auth"
                className="text-sm font-medium text-zinc-400 hover:text-vault-gold-light"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-lg bg-vault-gold px-4 py-2 text-sm font-semibold text-vault-bg transition-colors hover:bg-vault-gold-light"
              >
                Create account
              </Link>
            </>
          ) : null}
        </div>

        <button
          className="shrink-0 md:hidden text-zinc-300"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-vault-bg px-4 py-4 space-y-3">
          <Link to="/browse" onClick={() => setOpen(false)} className="block text-sm text-zinc-300">
            Marketplace
          </Link>
          <Link to="/smm" onClick={() => setOpen(false)} className="block text-sm text-zinc-300">
            SMM Services
          </Link>
          {user && !isAdmin && (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block text-sm text-zinc-300">
                Dashboard
              </Link>
              <Link to="/purchases" onClick={() => setOpen(false)} className="block text-sm text-zinc-300">
                My Accounts
              </Link>
              <Link to="/smm-orders" onClick={() => setOpen(false)} className="block text-sm text-zinc-300">
                My SMM Orders
              </Link>
              <Link to="/wallet" onClick={() => setOpen(false)} className="block text-sm text-zinc-300">
                Wallet ({balance === null ? "—" : formatNairaDecimal(balance)})
              </Link>
              <Link to="/fund" onClick={() => setOpen(false)} className="block text-sm font-semibold text-vault-gold-light">
                + Fund wallet
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="block text-sm font-semibold text-vault-gold">
              Admin panel
            </Link>
          )}
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          ) : (
            <>
              <Link to="/auth" onClick={() => setOpen(false)} className="block text-sm text-zinc-300">
                Sign in
              </Link>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                onClick={() => setOpen(false)}
                className="block text-sm font-semibold text-vault-gold-light"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex flex-col gap-1">
          <span className="font-sora text-lg font-semibold text-vault-gold-light">NexaLogs</span>
          <p className="text-[10px] text-zinc-500">© {new Date().getFullYear()} NexaLogs. All rights reserved.</p>
        </div>
        <div className="flex gap-8 text-xs font-medium text-zinc-500">
          <Link to="/browse" className="hover:text-zinc-300">Marketplace</Link>
          <a href="mailto:support@nexalogs.com" className="hover:text-zinc-300">Support</a>
        </div>
      </div>
    </footer>
  );
}
