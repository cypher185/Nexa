import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, LayoutDashboard, Package, FolderTree, ShoppingBag, Users, Wallet, Plug, Settings, ArrowLeft, LogOut, Zap, Layers, Activity } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/wallet", label: "Transactions", icon: Wallet },
  { to: "/admin/providers", label: "Providers", icon: Plug },
  { to: "/admin/smm-providers", label: "SMM Panels", icon: Zap },
  { to: "/admin/smm-services", label: "SMM Services", icon: Layers },
  { to: "/admin/smm-orders", label: "SMM Orders", icon: Activity },
  { to: "/admin/smm-poll-log", label: "SMM Poll Log", icon: Activity },
  { to: "/admin/diagnostics", label: "Diagnostics", icon: Activity },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/" });
  };

  useEffect(() => {
    if (loading) return;
    if (!user) {
      void navigate({ to: "/auth", search: { mode: "signin", redirect: "/admin" } });
      return;
    }
    if (!isAdmin) {
      void navigate({ to: "/" });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-vault-bg">
        <Loader2 className="size-6 animate-spin text-vault-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vault-bg">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/5 bg-vault-surface/40 p-6 md:block">
          <Link to="/admin" className="block">
            <span className="font-sora text-lg font-semibold text-vault-gold-light">NexaLogs</span>
            <span className="ml-2 rounded-md bg-vault-gold/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-vault-gold">
              Admin
            </span>
          </Link>

          <nav className="mt-10 space-y-1">
            {NAV.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-vault-gold/10 text-vault-gold-light"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <n.icon className="size-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/"
            className="mt-10 flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300"
          >
            <ArrowLeft className="size-3" /> Back to storefront
          </Link>
          <button
            onClick={handleSignOut}
            className="mt-4 flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          {/* mobile top bar */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 md:hidden">
            <Link to="/admin" className="font-sora text-base font-semibold text-vault-gold-light">
              NexaLogs Admin
            </Link>
            <button onClick={handleSignOut} className="inline-flex items-center gap-1 text-xs text-zinc-400">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>

          <main className="px-4 py-6 pb-24 md:px-10 md:py-10 md:pb-10">
            <Outlet />
          </main>

          {/* mobile bottom nav — fixed so it stays pinned regardless of content height */}
          <nav className="fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto border-t border-white/5 bg-vault-bg/95 backdrop-blur md:hidden">
            {NAV.map((n) => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex min-w-[64px] shrink-0 flex-1 flex-col items-center gap-1 py-2 text-[10px] ${
                    active ? "text-vault-gold-light" : "text-zinc-500"
                  }`}
                >
                  <n.icon className="size-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
