"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ApiRequestError } from "@/lib/api";
import Particles from "@/components/particles";
import Logo from "@/components/logo";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.messages.join(", "));
      } else {
        setError("Could not reach the server. Check your connection.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-text placeholder:text-muted/50 outline-none transition focus:border-brand";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-line lg:flex lg:flex-col lg:justify-between lg:p-14">
        <Particles />
        <div className="grid-lines" />
        <div className="glow" />

        <Link href="/" className="relative z-10">
          <Logo />
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight text-text">
            Openings, applicants and decisions in one place.
          </h2>
          <div className="rule my-8" />
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Candidates</dt>
              <dd className="text-text">Apply once, track the status</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Companies</dt>
              <dd className="text-text">Publish roles, review applicants</dd>
            </div>
          </dl>
        </div>

        <p className="relative z-10 text-xs text-muted/60">
          NestJS - PostgreSQL - Next.js
        </p>
      </aside>

      <main className="relative flex items-center justify-center overflow-hidden px-6 py-14">
        <div className="glow lg:hidden" />

        <div className="relative z-10 w-full max-w-sm">
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>

          <h1 className="mt-8 font-display text-3xl font-bold text-text lg:mt-0">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-muted">
            Use the email you registered with.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div>
              <label className="text-sm text-muted">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-muted">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                placeholder="Your password"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full rounded-lg py-3 font-semibold disabled:opacity-50"
            >
              {submitting ? "Signing in" : "Sign in"}
            </button>
          </form>

          <p className="mt-7 text-sm text-muted">
            No account yet?{" "}
            <Link
              href="/register"
              className="font-medium text-brand underline underline-offset-4 transition hover:text-brand-soft"
            >
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
