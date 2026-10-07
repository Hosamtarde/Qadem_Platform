"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { listJobs } from "@/lib/jobs";
import { useAuth } from "@/lib/auth-context";
import {
  Job,
  JobType,
  JobFilters,
  PaginationMeta,
} from "@/lib/types";
import Logo from "@/components/logo";
import LanguageToggle from "@/components/language-toggle";
import { useT } from "@/lib/i18n/context";
import { cityKey, jobTypeKey } from "@/lib/i18n/dictionaries";

const TYPES: (JobType | "ALL")[] = [
  "ALL",
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
];
const CITIES = ["Ramallah", "Nablus", "Hebron", "Rawabi"];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

function PublicJobsView() {
  const tr = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();

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
      router.push(qs ? `/jobs?${qs}` : "/jobs");
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
      .catch(() => setError(tr("jobs.loadError")))
      .finally(() => setLoading(false));
  }, [search, type, location, sortBy, page]);

  const activeCount = (search ? 1 : 0) + (type ? 1 : 0) + (location ? 1 : 0);

  return (
    <div className="relative min-h-screen">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            {user ? (
              <Link
                href="/dashboard"
                className="btn-primary rounded-lg px-5 py-2 text-sm font-semibold"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-text"
                >
                  {tr("nav.signIn")}
                </Link>
                <Link
                  href="/register"
                  className="btn-primary ms-2 rounded-lg px-5 py-2 text-sm font-semibold"
                >
                  {tr("nav.getStarted")}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className="glow" />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-text">
          {tr("jobs.title")}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {loading
            ? tr("common.searching")
            : meta
              ? tr(meta.total === 1 ? "jobs.countOne" : "jobs.countMany", {
                  count: meta.total,
                })
              : ""}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            push({ search: searchInput });
          }}
          className="mt-7 flex gap-2"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={tr("jobs.searchPlaceholder")}
            className="flex-1 rounded-lg border border-line bg-panel px-4 py-3 text-text placeholder:text-muted/50 outline-none transition focus:border-brand"
          />
          <button
            type="submit"
            className="btn-primary rounded-lg px-6 py-3 text-sm font-semibold"
          >
            {tr("common.search")}
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
                  {t === "ALL" ? tr("jobs.allTypes") : tr(jobTypeKey(t as JobType))}
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
                {tr(cityKey(c))}
              </button>
            ))}
          </div>

          {activeCount > 0 && (
            <button
              onClick={() => router.push("/jobs")}
              className="px-3 py-2 text-xs text-muted underline underline-offset-4 transition hover:text-text"
            >
              {tr("jobs.clearFilters")}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-8 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="surface mt-8 rounded-xl px-8 py-20 text-center">
            <p className="font-semibold text-text">{tr("jobs.noMatches")}</p>
            <p className="mt-2 text-sm text-muted">
              {tr("jobs.noMatchesBody")}
            </p>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => {
            const isIntern = job.type === "INTERNSHIP";
            const org = job.company?.name ?? tr("role.company");
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
                      {tr(cityKey(job.location))}
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
                    {tr(jobTypeKey(job.type))}
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
              {tr("common.previous")}
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
              {tr("common.next")}
            </button>
          </div>
        )}

        {!user && jobs.length > 0 && (
          <div className="surface mt-10 rounded-xl px-8 py-10 text-center">
            <p className="font-display text-xl font-bold text-text">
              {tr("jobs.readyTitle")}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              {tr("jobs.readyBody")}
            </p>
            <Link
              href="/register"
              className="btn-primary mt-6 inline-block rounded-lg px-6 py-3 text-sm font-semibold"
            >
              {tr("common.createAccount")}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PublicJobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted">Loading</p>
        </div>
      }
    >
      <PublicJobsView />
    </Suspense>
  );
}
