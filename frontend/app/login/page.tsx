"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ApiRequestError } from "@/lib/api";
import { resendVerification } from "@/lib/auth";
import Particles from "@/components/particles";
import Logo from "@/components/logo";
import LanguageToggle from "@/components/language-toggle";
import { useT } from "@/lib/i18n/context";

export default function LoginPage() {
  const t = useT();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">(
    "idle",
  );
  const [resendError, setResendError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setResendState("idle");
    setResendError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.messages.includes("EMAIL_NOT_VERIFIED")) {
          setUnverified(true);
        } else {
          setError(err.messages.join(", "));
        }
      } else {
        setError(t("auth.networkError"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResendState("sending");
    setResendError("");
    try {
      await resendVerification(email);
      setResendState("sent");
    } catch (err) {
      setResendState("idle");
      if (err instanceof ApiRequestError && err.statusCode === 429) {
        setResendError(t("auth.tooManyAttempts"));
      } else {
        setResendError(t("auth.resendFailed"));
      }
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
            {t("auth.asideTitle")}
          </h2>
          <div className="rule my-8" />
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">{t("auth.asideCandidates")}</dt>
              <dd className="text-text">{t("auth.asideCandidatesBody")}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">{t("auth.asideCompanies")}</dt>
              <dd className="text-text">{t("auth.asideCompaniesBody")}</dd>
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
            {t("auth.signInTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {t("auth.signInSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div>
              <label className="text-sm text-muted">{t("auth.email")}</label>
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
              <label className="text-sm text-muted">{t("auth.password")}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={field}
                placeholder={t("auth.passwordPlaceholder")}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}

            {unverified && (
              <div className="rounded-lg border border-line bg-panel px-4 py-4 text-sm">
                <p className="font-medium text-text">
                  {t("auth.notVerified")}
                </p>
                <p className="mt-1.5 leading-relaxed text-muted">
                  {t("auth.notVerifiedBody")}
                </p>

                {resendState === "sent" ? (
                  <p className="mt-3 text-brand">
                    {t("auth.linkSent", { email })}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendState === "sending"}
                    className="mt-3 font-medium text-brand underline underline-offset-4 transition hover:text-brand-soft disabled:opacity-50"
                  >
                    {resendState === "sending"
                      ? t("auth.sending")
                      : t("auth.resendLink")}
                  </button>
                )}

                {resendError && (
                  <p className="mt-2 text-danger">{resendError}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full rounded-lg py-3 font-semibold disabled:opacity-50"
            >
              {submitting ? t("auth.signingIn") : t("auth.signIn")}
            </button>
          </form>

          <p className="mt-7 text-sm text-muted">
            {t("auth.noAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-brand underline underline-offset-4 transition hover:text-brand-soft"
            >
              {t("auth.createOne")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}