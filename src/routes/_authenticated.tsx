import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGuard,
});

function AuthGuard() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      void navigate({
        to: "/auth",
        search: { mode: "signin", redirect: window.location.pathname },
      });
      return;
    }
    if (isAdmin) {
      void navigate({ to: "/admin" });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-vault-bg">
        <Loader2 className="size-6 animate-spin text-vault-gold" />
      </div>
    );
  }

  return <Outlet />;
}
