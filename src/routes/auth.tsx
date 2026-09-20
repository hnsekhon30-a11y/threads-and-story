import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Haseenaa by Hasneet Kaur" },
      {
        name: "description",
        content: "Sign in to manage the Haseenaa by Hasneet Kaur product catalogue.",
      },
      { property: "og:title", content: "Sign in — Haseenaa by Hasneet Kaur" },
      {
        property: "og:description",
        content: "Private sign in for the Haseenaa by Hasneet Kaur studio.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [loading, session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (err) setError(err.message);
      else if (!data.session)
        setMessage("Check your inbox and click the confirmation link to finish.");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    }
    setBusy(false);
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio</p>
      <h1 className="mt-2 font-serif text-4xl text-foreground">
        {mode === "signin" ? "Sign in" : "Create your account"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This area is private — it's where you add and edit your products.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent pb-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-foreground/80">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-primary py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError(null);
          setMessage(null);
        }}
        className="mt-6 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-primary"
      >
        {mode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
      </button>
    </section>
  );
}
