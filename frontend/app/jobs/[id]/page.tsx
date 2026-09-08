"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getJob } from "@/lib/jobs";
import { Job, JOB_TYPE_LABELS } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/logo";

export default function JobDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch(() => setError("This opening is no longer available."))
      .finally(() => setLoading(false));
  }, [id]);

  const isIntern = job?.type === "INTERNSHIP";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/jobs" className="btn-ghost rounded-lg px-4 py-2 text-sm">
            All openings
          </Link>
        </div>
      </header>

      <div className="glow" />

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-14">
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

            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-text">
              {job.title}
            </h1>

            <p className="mt-3 text-muted">
              {job.company?.name ?? "Company"} - {job.location}
            </p>

            <div className="rule my-9" />

            <section className="surface rounded-xl p-8">
              <h2 className="text-sm font-semibold text-brand">
                About this role
              </h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                {job.description}
              </p>

              {job.requirements && (
                <>
                  <h2 className="mt-9 text-sm font-semibold text-brand">
                    Requirements
                  </h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
                    {job.requirements}
                  </p>
                </>
              )}
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

            <div className="mt-9">
              {!user && (
                <Link
                  href="/login"
                  className="btn-primary block rounded-lg py-3.5 text-center font-semibold"
                >
                  Sign in to apply
                </Link>
              )}

              {user?.role === "CANDIDATE" && (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-line py-3.5 text-sm text-muted/60"
                >
                  Applying opens with the applications module
                </button>
              )}

              {user?.role === "COMPANY" && (
                <p className="rounded-lg border border-line px-4 py-3.5 text-center text-sm text-muted">
                  You are signed in as a company. Only candidates can apply.
                </p>
              )}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
