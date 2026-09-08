"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getJob } from "@/lib/jobs";
import { Job, JOB_TYPE_LABELS } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import Reveal from "@/components/reveal";

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
      <div className="aura" />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-display text-2xl font-bold text-chalk">
          Job<span className="text-cyan">.</span>Platform
        </Link>
        <Link
          href="/jobs"
          className="rounded-lg border border-line px-4 py-2 text-sm text-fog transition hover:border-cyan/50 hover:text-chalk"
        >
          All openings
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        {loading && <p className="text-fog">Loading</p>}

        {error && (
          <p className="rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3 text-sm text-magenta">
            {error}
          </p>
        )}

        {job && (
          <Reveal>
            <article>
              <span
                className={
                  isIntern
                    ? "rounded-md border border-magenta/40 px-3 py-1 text-xs font-medium text-magenta"
                    : "rounded-md border border-cyan/30 px-3 py-1 text-xs font-medium text-cyan"
                }
              >
                {JOB_TYPE_LABELS[job.type]}
              </span>

              <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-chalk">
                {job.title}
              </h1>

              <p className="mt-4 text-fog">
                {job.company?.name ?? "Company"} - {job.location}
              </p>

              <div className="beam my-10" />

              <section className="card rounded-2xl p-8">
                <h2 className="font-display text-sm font-bold tracking-wider text-cyan">
                  ABOUT THIS ROLE
                </h2>
                <p className="mt-5 whitespace-pre-line leading-relaxed text-fog">
                  {job.description}
                </p>

                {job.requirements && (
                  <>
                    <h2 className="mt-10 font-display text-sm font-bold tracking-wider text-cyan">
                      REQUIREMENTS
                    </h2>
                    <p className="mt-5 whitespace-pre-line leading-relaxed text-fog">
                      {job.requirements}
                    </p>
                  </>
                )}
              </section>

              <div className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                <div className="bg-surface p-6">
                  <p className="text-sm text-fog">Type</p>
                  <p className="mt-2 font-display font-bold text-chalk">
                    {JOB_TYPE_LABELS[job.type]}
                  </p>
                </div>
                <div className="bg-surface p-6">
                  <p className="text-sm text-fog">Location</p>
                  <p className="mt-2 font-display font-bold text-chalk">
                    {job.location}
                  </p>
                </div>
                <div className="bg-surface p-6">
                  <p className="text-sm text-fog">Salary</p>
                  <p className="mt-2 font-display font-bold text-chalk">
                    {job.salaryMin || job.salaryMax
                      ? `${job.salaryMin ?? "?"} - ${job.salaryMax ?? "?"}`
                      : "Not disclosed"}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                {!user && (
                  <Link
                    href="/login"
                    className="btn-glow block rounded-xl bg-cyan py-4 text-center font-bold text-void"
                  >
                    Sign in to apply
                  </Link>
                )}

                {user?.role === "CANDIDATE" && (
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-line py-4 text-sm text-fog/50"
                  >
                    Applying opens with the applications module
                  </button>
                )}

                {user?.role === "COMPANY" && (
                  <p className="rounded-xl border border-line px-4 py-4 text-center text-sm text-fog">
                    You are signed in as a company. Only candidates can apply.
                  </p>
                )}
              </div>
            </article>
          </Reveal>
        )}
      </main>
    </div>
  );
}
