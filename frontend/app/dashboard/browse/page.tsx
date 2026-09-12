"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { listJobs } from "@/lib/jobs";
import {
  Job,
  JobType,
  JobFilters,
  PaginationMeta,
  JOB_TYPE_LABELS,
} from "@/lib/types";

const TYPES: (JobType | "ALL")[] = [
  "ALL",
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
];
const CITIES = ["Ramallah", "Nablus", "Hebron", "Rawabi"];
const SORTS: { key: "newest" | "oldest" | "salary"; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "salary", label: "Highest salary" },
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

function BrowseView() {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get("search") ?? "";
  const type = (params.get("type") as JobType | null) ?? null;
  const location = params.get("location") ?? "";
  const sortBy = (params.get("sortBy") as JobFilters["sortBy"]) ?? "newest";
  const page = Number(params.get("page") ?? 1);

  const [searchInput, setSearchInput] = useState(search);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const push = useCallback(
    (next: Record<string, string | null>) => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(next).forEach(([key, value]) => {
        if (value === null || value === "") sp.delete(key);
        else sp.set(key, value);
      });
      if (!("page" in next)) sp.delete("page");
      const qs = sp.toString();
      router.push(qs ? `/dashboard/browse?${qs}` : "/dashboard/browse");
    },
    [params, router],
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    listJobs({
      search: search || undefined,
      type: type ?? undefined,
      location: location || undefined,
      sortBy,
      page,
      limit: 9,
    })
      .then((res) => {
        setJobs(res.data);
        setMeta(res.meta);
      })
      .catch(() => setError("Could not load openings. Try again shortly."))
      .finally(() => setLoading(false));
  }, [search, type, location, sortBy, page]);

  const activeCount = (search ? 1 : 0) + (type ? 1 : 0) + (location ? 1 : 0);

  return (
    <>
      <header className="border-b border-line px-6 py-5 lg:px-10">
        <p className="text-sm text-muted">Browse</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-text">
          Open positions
        </h1>
      </header>

      <main className="px-6 py-8 lg:px-10">
        <p className="text-sm text-muted">
          {loading
            ? "Searching"
            : meta
              ? `${meta.total} ${meta.total === 1 ? "role" : "roles"} found`
              : ""}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            push({ search: searchInput });
          }}
          className="mt-6 flex gap-2"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or description"
            className="flex-1 rounded-lg border border-line bg-panel px-4 py-3 text-text placeholder:text-muted/50 outline-none transition focus:border-brand"
          />
          <button
            type="submit"
            className="btn-primary rounded-lg px-6 py-3 text-sm font-semibold"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex gap-1 rounded-lg border border-line bg-panel p-1">
            {TYPES.map((t) => {
              const active = t === "ALL" ? !type : type === t;
              return (
                <button
                  key={t}
                  onClick={() => push({ type: t === "ALL" ? null : t })}
                  className={
                    active
                      ? "btn-primary rounded-md px-4 py-2 text-xs font-semibold"
                      : "rounded-md px-4 py-2 text-xs text-muted transition hover:text-text"
                  }
                >
                  {t === "ALL" ? "All types" : JOB_TYPE_LABELS[t as JobType]}
                </button>
              );
            })}
          </div>

          <div className="inline-flex flex-wrap gap-1.5">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => push({ location: location === c ? null : c })}
                className={
                  location === c
                    ? "rounded-lg border border-brand/60 bg-panel-2 px-4 py-2 text-xs font-medium text-brand-soft"
                    : "btn-ghost rounded-lg px-4 py-2 text-xs"
                }
              >
                {c}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => push({ sortBy: e.target.value })}
            className="rounded-lg border border-line bg-panel px-3 py-2 text-xs text-muted outline-none transition focus:border-brand"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>

          {activeCount > 0 && (
            <button
              onClick={() => router.push("/dashboard/browse")}
              className="px-3 py-2 text-xs text-muted underline underline-offset-4 transition hover:text-text"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="surface mt-6 rounded-xl px-8 py-20 text-center">
            <p className="font-semibold text-text">No matches</p>
            <p className="mt-2 text-sm text-muted">
              Try a different search term or clear some filters.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => {
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
                    <p className="truncate text-xs text-muted">
                      {job.location}
                    </p>
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

        {meta && meta.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => push({ page: String(page - 1) })}
              className="btn-ghost rounded-lg px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (n) => (
                <button
                  key={n}
                  onClick={() => push({ page: String(n) })}
                  className={
                    n === page
                      ? "btn-primary h-9 w-9 rounded-lg text-sm font-semibold"
                      : "btn-ghost h-9 w-9 rounded-lg text-sm"
                  }
                >
                  {n}
                </button>
              ),
            )}

            <button
              disabled={page >= meta.totalPages}
              onClick={() => push({ page: String(page + 1) })}
              className="btn-ghost rounded-lg px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted">Loading</p>
        </div>
      }
    >
      <BrowseView />
    </Suspense>
  );
}
