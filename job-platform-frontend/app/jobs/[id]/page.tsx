"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getJob } from "@/lib/jobs";
import { Job, JOB_TYPE_LABELS } from "@/lib/types";

export default function JobDetailPage() {
  const params = useParams();
  const id = String(params.id);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch(() => setError("This opening is no longer available."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mesh" />
      <div className="halo" />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-7">
        <Link href="/" className="font-display text-2xl text-chalk">
          Job Platform
        </Link>
        <Link
          href="/jobs"
          className="rounded-lg border border-line px-4 py-2 text-sm text-fog transition hover:text-chalk"
        >
          All openings
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        {loading && <p className="text-fog">Loading</p>}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {job && (
          <article className="rise rise-1">
            <span className="rounded-md border border-line px-2.5 py-1 text-xs text-gold-soft">
              {JOB_TYPE_LABELS[job.type]}
            </span>

            <h1 className="mt-5 font-display text-5xl leading-tight text-chalk">
              {job.title}
            </h1>

            <p className="mt-3 text-fog">
              {job.company?.name ?? "Company"} - {job.location}
            </p>

            <div className="hairline my-9" />

            <section className="panel rounded-xl p-8">
              <h2 className="text-sm font-medium text-chalk">About this role</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-fog">
                {job.description}
              </p>

              {job.requirements && (
                <>
                  <h2 className="mt-9 text-sm font-medium text-chalk">
                    Requirements
                  </h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-fog">
                    {job.requirements}
                  </p>
                </>
              )}
            </section>

            <div className="mt-5 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              <div className="bg-surface/80 p-6">
                <p className="text-sm text-fog">Type</p>
                <p className="mt-2 text-chalk">{JOB_TYPE_LABELS[job.type]}</p>
              </div>
              <div className="bg-surface/80 p-6">
                <p className="text-sm text-fog">Location</p>
                <p className="mt-2 text-chalk">{job.location}</p>
              </div>
              <div className="bg-surface/80 p-6">
                <p className="text-sm text-fog">Salary</p>
                <p className="mt-2 text-chalk">
                  {job.salaryMin || job.salaryMax
                    ? `${job.salaryMin ?? "?"} - ${job.salaryMax ?? "?"}`
                    : "Not disclosed"}
                </p>
              </div>
            </div>

            <button
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-lg border border-line py-3.5 text-sm text-fog/50"
            >
              Applying opens with the applications module
            </button>
          </article>
        )}
      </main>
    </div>
  );
}
