"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ApiRequestError } from "@/lib/api";
import { UserRole } from "@/lib/types";
import Particles from "@/components/particles";
import Logo from "@/components/logo";

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CANDIDATE");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ fullName, email, password, role });
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

  const isCandidate = role === "CANDIDATE";

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
            Two sides. One platform.
          </h2>
          <div className="rule my-8" />
          <p className="leading-relaxed text-muted">
            Candidates search openings and follow each application from sent to
            decided. Companies publish roles and move applicants through their
            pipeline. Pick your side on the right.
          </p>
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isCandidate
              ? "Apply to openings and track every application."
              : "Publish openings and review who applied."}
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-panel p-1">
              <button
                type="button"
                onClick={() => setRole("CANDIDATE")}
                className={
                  isCandidate
                    ? "btn-primary rounded-md py-2.5 text-sm font-semibold"
                    : "rounded-md py-2.5 text-sm text-muted transition hover:text-text"
                }
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole("COMPANY")}
                className={
                  !isCandidate
                    ? "btn-primary rounded-md py-2.5 text-sm font-semibold"
                    : "rounded-md py-2.5 text-sm text-muted transition hover:text-text"
                }
              >
                Company
              </button>
            </div>

            <div>
              <label className="text-sm text-muted">
                {isCandidate ? "Full name" : "Company name"}
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={field}
                placeholder={isCandidate ? "Ahmad Nasser" : "Wahj"}
              />
            </div>

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
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                placeholder="At least 8 characters"
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
              {submitting ? "Creating account" : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-sm text-muted">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-medium text-brand underline underline-offset-4 transition hover:text-brand-soft"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
