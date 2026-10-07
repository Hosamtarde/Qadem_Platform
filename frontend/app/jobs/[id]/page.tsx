"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getJob } from "@/lib/jobs";
import { applyToJob, hasApplied } from "@/lib/applications";
import { getMyProfile } from "@/lib/candidates";
import { CandidateProfile, Job } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { ApiRequestError } from "@/lib/api";
import Logo from "@/components/logo";
import LanguageToggle from "@/components/language-toggle";
import { useT } from "@/lib/i18n/context";
import { cityKey, jobTypeKey } from "@/lib/i18n/dictionaries";
import ResponseBadge from "@/components/response-badge";

export default function JobDetailPage() {
  const t = useT();
  const params = useParams();
  const id = String(params.id);
  const { user, loading: authLoading } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applied, setApplied] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch(() => setError(t("job.gone")))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== "CANDIDATE") return;
    hasApplied(id)
      .then((res) => setApplied(res.applied))
      .catch(() => setApplied(false));
    getMyProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [user, id]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setApplyError("");
    setSubmitting(true);
    try {
      await applyToJob(id, coverLetter.trim() || undefined);
      setApplied(true);
      setFormOpen(false);
      setCoverLetter("");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setApplyError(err.messages.join(", "));
        if (err.statusCode === 409) setApplied(true);
      } else {
        setApplyError(t("job.applyError"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  const isIntern = job?.type === "INTERNSHIP";
  const isCandidate = user?.role === "CANDIDATE";
  const noteTooShort = coverLetter.length > 0 && coverLetter.length < 20;
  const hasResume = Boolean(profile?.hasResumeFile || profile?.resumeUrl);

  return (
    <div className="relative min-h-screen">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <LanguageToggle className="me-2" />
          <Link href="/jobs" className="btn-ghost rounded-lg px-4 py-2 text-sm">
            {t("job.allOpenings")}
          </Link>
        </div>
      </header>

      <div className="glow" />

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-10">
        {loading && <p className="text-muted">{t("common.loading")}</p>}

        {error && (
          <p className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {job && (
          <article>
            <span
              className={isIntern ? "badge badge-brand" : "badge badge-neutral"}
            >
              {t(jobTypeKey(job.type))}
            </span>

            <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-text sm:text-4xl">
              {job.title}
            </h1>

            <p className="mt-3 text-muted">
              {job.company?.name ?? t("role.company")} - {t(cityKey(job.location))}
            </p>

            <div className="mt-4">
              <ResponseBadge
                rate={job.company?.responseRate ?? null}
                avgDays={job.company?.avgResponseDays ?? null}
                sampleSize={job.company?.responseSampleSize}
              />
            </div>

            <div className="rule my-8" />

            <section className="surface rounded-xl p-8">
              <h2 className="text-sm font-semibold text-brand">
                {t("job.about")}
              </h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                {job.description}
              </p>

              {job.requirements ? (
                <>
                  <h2 className="mt-8 text-sm font-semibold text-brand">
                    {t("job.requirements")}
                  </h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                    {job.requirements}
                  </p>
                </>
              ) : null}
            </section>

            <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">{t("job.type")}</p>
                <p className="mt-2 font-semibold text-text">
                  {t(jobTypeKey(job.type))}
                </p>
              </div>
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">{t("job.location")}</p>
                <p className="mt-2 font-semibold text-text">
                  {t(cityKey(job.location))}
                </p>
              </div>
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">{t("job.salary")}</p>
                <p className="mt-2 font-semibold text-text">
                  {job.salaryMin || job.salaryMax
                    ? `${job.salaryMin ?? "?"} - ${job.salaryMax ?? "?"}`
                    : t("job.salaryHidden")}
                </p>
              </div>
            </div>

            <div className="mt-8">
              {authLoading && (
                <p className="text-sm text-muted">{t("job.checkingSession")}</p>
              )}

              {!authLoading && !user && (
                <Link
                  href="/login"
                  className="btn-primary block rounded-lg py-3.5 text-center font-semibold"
                >
                  {t("job.signInToApply")}
                </Link>
              )}

              {!authLoading && user?.role === "COMPANY" && (
                <p className="rounded-lg border border-line px-5 py-3.5 text-center text-sm text-muted">
                  {t("job.companyCannotApply")}
                </p>
              )}

              {!authLoading && isCandidate && applied && (
                <div className="surface rounded-xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">
                        {t("job.applicationSent")}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {t("job.followStatus")}
                      </p>
                    </div>
                    <Link
                      href="/dashboard/applications"
                      className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-semibold"
                    >
                      {t("job.viewApplications")}
                    </Link>
                  </div>
                </div>
              )}

              {!authLoading && isCandidate && !applied && !formOpen && (
                <button
                  onClick={() => setFormOpen(true)}
                  className="btn-primary w-full rounded-lg py-3.5 font-semibold"
                >
                  {t("job.apply")}
                </button>
              )}

              {!authLoading && isCandidate && !applied && formOpen && (
                <form onSubmit={handleApply} className="surface rounded-xl p-7">
                  <h2 className="text-sm font-semibold text-brand">
                    {t("job.yourApplication")}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    {t("job.noteOptional")}
                  </p>

                  {hasResume ? (
                    <div className="mt-5 rounded-lg border border-line bg-panel-2 px-4 py-3">
                      <p className="text-xs text-muted">
                        {t("job.sendingAs")}{" "}
                        <span className="text-text">{profile?.fullName}</span>
                        {profile?.headline ? ` - ${profile.headline}` : ""}
                        {profile?.skills.length
                          ? ` - ${t("job.skillCount", { count: profile.skills.length })}`
                          : ""}
                        {` - ${t("job.resumeAttached")} `}
                        <Link href="/dashboard/profile" className="text-brand underline underline-offset-4">{t("job.reviewProfile")}</Link>
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-lg border border-warn/40 bg-warn/10 px-4 py-3">
                      <p className="text-sm font-medium text-warn">
                        {t("job.noResume")}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {t("job.noResumeBody")}
                      </p>
                      <Link href="/dashboard/profile" className="btn-primary mt-3 inline-block rounded-lg px-4 py-2 text-xs font-semibold">{t("job.addResume")}</Link>
                    </div>
                  )}

                  <textarea
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder={t("job.notePlaceholder")}
                    className="mt-5 w-full rounded-lg border border-line bg-panel px-4 py-3 text-text placeholder:text-muted/50 outline-none transition focus:border-brand"
                  />

                  {noteTooShort && (
                    <p className="mt-2 text-xs text-warn">
                      {t("job.noteTooShort")}
                    </p>
                  )}

                  {applyError && (
                    <p className="mt-5 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                      {applyError}
                    </p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting || noteTooShort || !hasResume}
                      className="btn-primary rounded-lg px-7 py-3 font-semibold disabled:opacity-50"
                    >
                      {submitting ? t("job.sending") : t("job.sendApplication")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="btn-ghost rounded-lg px-7 py-3 font-semibold"
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}