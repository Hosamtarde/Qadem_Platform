"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { listJobs } from "@/lib/jobs";
import { Job, JOB_TYPE_LABELS } from "@/lib/types";
import Logo from "@/components/logo";

type Tab = "ALL" | "JOBS" | "INTERNSHIP";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("ALL");
  const [city, setCity] = useState<string>("ALL");

  useEffect(() => {
    listJobs()
      .then(setJobs)
      .catch(() => setError("Could not load openings. Try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  const citiesList = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location));
    return Array.from(set).sort();
  }, [jobs]);

  const visible = useMemo(() => {
    let list = jobs;
    if (tab === "INTERNSHIP") list = list.filter((j) => j.type === "INTERNSHIP");
    if (tab === "JOBS") list = list.filter((j) => j.type !== "INTERNSHIP");
    if (city !== "ALL") list = list.filter((j) => j.location === city);
    return list;
  }, [jobs, tab, city]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "JOBS", label: "Jobs" },
    { key: "INTERNSHIP", label: "Internships" },
  ];

  return (
    <div className="relative min-h-screen">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/dashboard" className="btn-ghost rounded-lg px-4 py-2 text-sm">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-text">
          Open positions
        </h1>
        <p className="mt-2 text-sm text-muted">
          {loading
            ? "Loading"
            : `${visible.length} ${visible.length === 1 ? "role" : "roles"} available`}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="inline-flex gap-1 rounded-lg border border-line bg-panel p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  tab === t.key
                    ? "btn-primary rounded-md px-4 py-2 text-sm font-semibold"
                    : "rounded-md px-4 py-2 text-sm text-muted transition hover:text-text"
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          {citiesList.length > 1 && (
            <div className="inline-flex flex-wrap gap-2">
              <button
                onClick={() => setCity("ALL")}
                className={
                  city === "ALL"
                    ? "rounded-lg border border-brand/60 bg-panel-2 px-4 py-2 text-sm font-medium text-brand-soft"
                    : "btn-ghost rounded-lg px-4 py-2 text-sm"
                }
              >
                Everywhere
              </button>
              {citiesList.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={
                    city === c
                      ? "rounded-lg border border-brand/60 bg-panel-2 px-4 py-2 text-sm font-medium text-brand-soft"
                      : "btn-ghost rounded-lg px-4 py-2 text-sm"
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-8 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="surface mt-8 rounded-xl px-8 py-20 text-center">
            <p className="font-semibold text-text">Nothing here yet</p>
            <p className="mt-2 text-sm text-muted">
              No openings match these filters.
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((job) => {
            const isIntern = job.type === "INTERNSHIP";
            const org = job.company?.name ?? "Company";
            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="surface surface-hover flex flex-col rounded-xl p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-panel-2 text-xs font-semibold text-brand-soft">
                    {initials(org)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">
                      {org}
                    </p>
                    <p className="truncate text-xs text-muted">{job.location}</p>
                  </div>
                </div>

                <h2 className="mt-5 font-display text-lg font-bold leading-snug text-text">
                  {job.title}
                </h2>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                  {job.description}
                </p>

                <div className="rule my-5" />

                <div className="flex items-center justify-between gap-3">
                  <span
                    className={
                      isIntern ? "badge badge-brand" : "badge badge-neutral"
                    }
                  >
                    {JOB_TYPE_LABELS[job.type]}
                  </span>
                  {(job.salaryMin || job.salaryMax) && (
                    <span className="text-xs font-semibold text-text">
                      {job.salaryMin ?? "?"} - {job.salaryMax ?? "?"}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
