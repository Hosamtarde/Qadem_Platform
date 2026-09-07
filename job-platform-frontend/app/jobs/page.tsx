"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listJobs } from "@/lib/jobs";
import { Job, JOB_TYPE_LABELS } from "@/lib/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listJobs()
      .then(setJobs)
      .catch(() => setError("Could not load openings. Try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="mesh" />
      <div className="halo" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-7">
        <Link href="/" className="font-display text-2xl text-chalk">
          Job Platform
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-line px-4 py-2 text-sm text-fog transition hover:text-chalk"
        >
          Dashboard
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <h1 className="rise rise-1 font-display text-5xl text-chalk">
          Open positions
        </h1>
        <p className="rise rise-1 mt-3 text-fog">
          {loading
            ? "Loading openings"
            : `${jobs.length} ${jobs.length === 1 ? "role" : "roles"} available right now`}
        </p>

        {error && (
          <p className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="panel mt-10 rounded-xl px-8 py-20 text-center">
            <p className="text-chalk">No openings yet</p>
            <p className="mt-2 text-sm text-fog">
              Companies have not published any roles so far. Check back later.
            </p>
          </div>
        )}

        <ul className="rise rise-2 mt-10 space-y-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="panel block rounded-xl p-6 transition hover:border-gold/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-chalk">
                      {job.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-fog">
                      {job.company?.name ?? "Company"} ? {job.location}
                    </p>
                  </div>
                  <span className="rounded-md border border-line px-2.5 py-1 text-xs text-gold-soft">
                    {JOB_TYPE_LABELS[job.type]}
                  </span>
                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-fog">
                  {job.description}
                </p>

                {(job.salaryMin ?? job.salaryMax) !== null && (
                  <p className="mt-4 text-sm text-jade">
                    {job.salaryMin ?? "?"} - {job.salaryMax ?? "?"}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
