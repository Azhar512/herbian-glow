import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Herbian Glow" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const input = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-blush";
  return (
    <Layout>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cocoa">{mode === "login" ? "Welcome back" : "Create an account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to continue your glow ritual." : "Join the Herbian Glow family."}
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-3 rounded-3xl bg-card p-8 shadow-sm">
          {mode === "register" && <input className={input} placeholder="Full name" required />}
          <input type="email" className={input} placeholder="Email" required />
          <input type="password" className={input} placeholder="Password" required />
          <button className="btn-pill w-full bg-cocoa text-primary-foreground hover:bg-blush">
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-center text-xs text-muted-foreground underline"
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-blush">← Back to home</Link>
        </p>
      </div>
    </Layout>
  );
}
