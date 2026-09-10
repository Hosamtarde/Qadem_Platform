"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getJob } from "@/lib/jobs";
import { applyToJob, hasApplied } from "@/lib/applications";
import { getMyProfile } from "@/lib/candidates";
import { CandidateProfile, Job, JOB_TYPE_LABELS } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { ApiRequestError } from "@/lib/api";
import Logo from "@/components/logo";

export default function JobDetailPage() {
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
      .catch(() => setError("This opening is no longer available."))
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
        setApplyError("Could not send your application.");
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
          <Link href="/jobs" className="btn-ghost rounded-lg px-4 py-2 text-sm">
            All openings
          </Link>
        </div>
      </header>

      <div className="glow" />

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-10">
        {loading && <p className="text-muted">Loading</p>}

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
              {JOB_TYPE_LABELS[job.type]}
            </span>

            <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-text sm:text-4xl">
              {job.title}
            </h1>

            <p className="mt-3 text-muted">
              {job.company?.name ?? "Company"} - {job.location}
            </p>

            <div className="rule my-8" />

            <section className="surface rounded-xl p-8">
              <h2 className="text-sm font-semibold text-brand">
                About this role
              </h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                {job.description}
              </p>

              {job.requirements ? (
                <>
                  <h2 className="mt-8 text-sm font-semibold text-brand">
                    Requirements
                  </h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                    {job.requirements}
                  </p>
                </>
              ) : null}
            </section>

            <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">Type</p>
                <p className="mt-2 font-semibold text-text">
                  {JOB_TYPE_LABELS[job.type]}
                </p>
              </div>
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">Location</p>
                <p className="mt-2 font-semibold text-text">{job.location}</p>
              </div>
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">Salary</p>
                <p className="mt-2 font-semibold text-text">
                  {job.salaryMin || job.salaryMax
                    ? `${job.salaryMin ?? "?"} - ${job.salaryMax ?? "?"}`
                    : "Not disclosed"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              {authLoading && (
                <p className="text-sm text-muted">Checking your session</p>
              )}

              {!authLoading && !user && (
                <Link
                  href="/login"
                  className="btn-primary block rounded-lg py-3.5 text-center font-semibold"
                >
                  Sign in to apply
                </Link>
              )}

              {!authLoading && user?.role === "COMPANY" && (
                <p className="rounded-lg border border-line px-5 py-3.5 text-center text-sm text-muted">
                  You are signed in as a company. Only candidates can apply.
                </p>
              )}

              {!authLoading && isCandidate && applied && (
                <div className="surface rounded-xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">
                        Application sent
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        You can follow its status from your applications.
                      </p>
                    </div>
                    <Link
                      href="/dashboard/applications"
                      className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-semibold"
                    >
                      View applications
                    </Link>
                  </div>
                </div>
              )}

              {!authLoading && isCandidate && !applied && !formOpen && (
                <button
                  onClick={() => setFormOpen(true)}
                  className="btn-primary w-full rounded-lg py-3.5 font-semibold"
                >
                  Apply for this role
                </button>
              )}

              {!authLoading && isCandidate && !applied && formOpen && (
                <form onSubmit={handleApply} className="surface rounded-xl p-7">
                  <h2 className="text-sm font-semibold text-brand">
                    Your application
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    A short note helps, but it is optional.
                  </p>

                  {hasResume ? (
                    <div className="mt-5 rounded-lg border border-line bg-panel-2 px-4 py-3">
                      <p className="text-xs text-muted">
                        Sending as{" "}
                        <span className="text-text">{profile?.fullName}</span>
                        {profile?.headline ? ` - ${profile.headline}` : ""}
                        {profile?.skills.length
                          ? ` - ${profile.skills.length} skills`
                          : ""}
                        {" - resume attached. "}
                        <Link href="/dashboard/profile" className="text-brand underline underline-offset-4">Review profile</Link>
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-lg border border-warn/40 bg-warn/10 px-4 py-3">
                      <p className="text-sm font-medium text-warn">
                        No resume on your profile
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Companies rarely review an application without one. Add
                        a file or a link, then come back.
                      </p>
                      <Link href="/dashboard/profile" className="btn-primary mt-3 inline-block rounded-lg px-4 py-2 text-xs font-semibold">Add your resume</Link>
                    </div>
                  )}

                  <textarea
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Why you are a fit for this role."
                    className="mt-5 w-full rounded-lg border border-line bg-panel px-4 py-3 text-text placeholder:text-muted/50 outline-none transition focus:border-brand"
                  />

                  {noteTooShort && (
                    <p className="mt-2 text-xs text-warn">
                      A note should be at least 20 characters, or leave it
                      empty.
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
                      {submitting ? "Sending" : "Send application"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormOpen(false)}
                      className="btn-ghost rounded-lg px-7 py-3 font-semibold"
                    >
                      Cancel
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
