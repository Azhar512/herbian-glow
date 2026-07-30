import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Herbian Glow" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const input = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-blush";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.invalidate();
      navigate({ to: "/admin" });
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cocoa">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your dashboard.
          </p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-3 rounded-3xl bg-card p-8 shadow-sm">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 mb-4 border border-red-100">
              {errorMsg}
            </div>
          )}
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input} 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input} 
            placeholder="Password" 
            required 
          />
          <button disabled={loading} type="submit" className="btn-pill w-full bg-cocoa text-primary-foreground hover:bg-blush disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-blush">← Back to home</Link>
        </p>
      </div>
    </Layout>
  );
}
