import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional().default("signin").catch("signin"),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const dest = search.redirect ?? (isAdmin ? "/admin" : "/dashboard");
      void navigate({ to: dest as string });
    }
  }, [user, isAdmin, loading, navigate, search.redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast.error("Supabase not configured", {
        description: "Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.",
      });
      return;
    }
    setSubmitting(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      setSubmitting(false);
      if (error) return toast.error(error.message);
      toast.success("Account created!", { description: "You're now signed in." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setSubmitting(false);
      if (error) return toast.error(error.message);
      toast.success("Welcome back");
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-vault-bg lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-vault-surface p-12 lg:flex">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-vault-gold/10 blur-[120px]" />
        <Link to="/" className="relative font-sora text-2xl font-semibold text-vault-gold-light">
          NexaLogs
        </Link>
        <div className="relative space-y-6">
          <h2 className="max-w-md font-sora text-4xl font-semibold text-white">
            Your vault for <span className="gold-text">premium aged accounts.</span>
          </h2>
          <p className="max-w-md text-sm text-zinc-400">
            Fund a wallet once. Buy instantly. Credentials delivered the second the transaction confirms — no waiting, no DMs.
          </p>
        </div>
        <p className="relative text-[10px] uppercase tracking-widest text-zinc-600">
          © {new Date().getFullYear()} NexaLogs Nigeria
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-12 block font-sora text-xl font-semibold text-vault-gold-light lg:hidden">
            NexaLogs
          </Link>
          <h1 className="font-sora text-2xl font-semibold text-white">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {mode === "signup"
              ? "Start funding your wallet and buying in seconds."
              : "Sign in to access your wallet and purchases."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-vault-surface px-4 py-3 text-sm text-white outline-none focus:border-vault-gold/40"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-vault-surface px-4 py-3 text-sm text-white outline-none focus:border-vault-gold/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-vault-surface px-4 py-3 text-sm text-white outline-none focus:border-vault-gold/40"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-vault-gold px-4 py-3 text-sm font-semibold text-vault-bg transition hover:bg-vault-gold-light disabled:opacity-60"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="font-medium text-vault-gold-light hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>

          <p className="mt-12 text-center text-[10px] text-zinc-600">
            <Link to="/" className="hover:text-zinc-400">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
