"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listJobs } from "@/lib/jobs";
import { Job, JOB_TYPE_LABELS } from "@/lib/types";
import Reveal from "@/components/reveal";

type Tab = "ALL" | "JOBS" | "INTERNSHIP";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("ALL");

  useEffect(() => {
    listJobs()
      .then(setJobs)
      .catch(() => setError("Could not load openings. Try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    if (tab === "INTERNSHIP") return jobs.filter((j) => j.type === "INTERNSHIP");
    if (tab === "JOBS") return jobs.filter((j) => j.type !== "INTERNSHIP");
    return jobs;
  }, [jobs, tab]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "JOBS", label: "Jobs" },
    { key: "INTERNSHIP", label: "Internships" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aura" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-display text-2xl font-bold text-chalk">
          Job<span className="text-cyan">.</span>Platform
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-line px-4 py-2 text-sm text-fog transition hover:border-cyan/50 hover:text-chalk"
        >
          Dashboard
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <Reveal>
          <h1 className="font-display text-5xl font-bold text-chalk sm:text-6xl">
            Open positions
          </h1>
          <p className="mt-4 text-fog">
            {loading
              ? "Loading openings"
              : `${visible.length} ${visible.length === 1 ? "role" : "roles"} available right now`}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-9 inline-flex gap-1.5 rounded-xl border border-line bg-surface p-1.5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  tab === t.key
                    ? "rounded-lg bg-cyan px-5 py-2.5 text-sm font-bold text-void"
                    : "rounded-lg px-5 py-2.5 text-sm text-fog transition hover:text-chalk"
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        {error && (
          <p className="mt-8 rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3 text-sm text-magenta">
            {error}
          </p>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="card mt-10 rounded-2xl px-8 py-20 text-center">
            <p className="text-chalk">Nothing here yet</p>
            <p className="mt-2 text-sm text-fog">
              No openings match this filter right now.
            </p>
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {visible.map((job, i) => {
            const isIntern = job.type === "INTERNSHIP";
            return (
              <Reveal key={job.id} delay={Math.min(i, 6) * 70}>
                <li>
                  <Link
                    href={`/jobs/${job.id}`}
                    className={`card block rounded-2xl p-7 ${isIntern ? "card-magenta" : ""}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-xl font-bold text-chalk">
                          {job.title}
                        </h2>
                        <p className="mt-2 text-sm text-fog">
                          {job.company?.name ?? "Company"} ? {job.location}
                        </p>
                      </div>
                      <span
                        className={
                          isIntern
                            ? "rounded-md border border-magenta/40 px-3 py-1 text-xs font-medium text-magenta"
                            : "rounded-md border border-cyan/30 px-3 py-1 text-xs font-medium text-cyan"
                        }
                      >
                        {JOB_TYPE_LABELS[job.type]}
                      </span>
                    </div>

                    <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-fog">
                      {job.description}
                    </p>

                    {(job.salaryMin || job.salaryMax) && (
                      <p className="mt-5 font-display text-sm font-bold text-chalk">
                        {job.salaryMin ?? "?"} - {job.salaryMax ?? "?"}
                        <span className="ml-1.5 font-sans font-normal text-fog">
                          per month
                        </span>
                      </p>
                    )}
                  </Link>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
