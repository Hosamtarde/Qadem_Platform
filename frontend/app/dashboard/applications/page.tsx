"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { listMyApplications } from "@/lib/applications";
import {
  Application,
  ApplicationStatus,
  STATUS_BADGES,
} from "@/lib/types";
import { useT } from "@/lib/i18n/context";
import { cityKey, jobTypeKey, statusKey } from "@/lib/i18n/dictionaries";

const FILTERS: (ApplicationStatus | "ALL")[] = [
  "ALL",
  "SUBMITTED",
  "REVIEWING",
  "ACCEPTED",
  "REJECTED",
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyApplicationsPage() {
  const t = useT();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "CANDIDATE") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "CANDIDATE") return;
    listMyApplications()
      .then(setApplications)
      .catch(() => setError(t("apps.loadError")))
      .finally(() => setLoading(false));
  }, [user]);

  const counts = useMemo(() => {
    const base: Record<string, number> = {
      SUBMITTED: 0,
      REVIEWING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    };
    applications.forEach((a) => {
      base[a.status] += 1;
    });
    return base;
  }, [applications]);

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? applications
        : applications.filter((a) => a.status === filter),
    [applications, filter],
  );

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <>
      <header className="border-b border-line px-6 py-5 lg:px-10">
        <p className="text-sm text-muted">{t("dash.candidateSpace")}</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-text">
          {t("nav.myApplications")}
        </h1>
      </header>

      <main className="px-6 py-8 lg:px-10">
        <p className="text-sm text-muted">
          {t(
            applications.length === 1 ? "apps.countOne" : "apps.countMany",
            { count: applications.length },
          )}
        </p>

        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {(
            ["SUBMITTED", "REVIEWING", "ACCEPTED", "REJECTED"] as ApplicationStatus[]
          ).map((s) => (
            <div key={s} className="bg-panel p-5">
              <span className={`badge ${STATUS_BADGES[s]}`}>
                {t(statusKey(s))}
              </span>
              <p className="mt-3 font-display text-2xl font-bold text-text">
                {counts[s]}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {applications.length === 0 && !error && (
          <div className="surface mt-6 rounded-xl px-8 py-16 text-center">
            <p className="font-semibold text-text">{t("apps.emptyTitle")}</p>
            <p className="mt-2 text-sm text-muted">{t("apps.emptyBody")}</p>
            <Link
              href="/dashboard/browse"
              className="btn-primary mt-7 inline-block rounded-lg px-6 py-2.5 text-sm font-semibold"
            >
              Browse openings
            </Link>
          </div>
        )}

        {applications.length > 0 && (
          <>
            <div className="mt-6 inline-flex flex-wrap gap-1 rounded-lg border border-line bg-panel p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? "btn-primary rounded-md px-4 py-2 text-xs font-semibold"
                      : "rounded-md px-4 py-2 text-xs text-muted transition hover:text-text"
                  }
                >
                  {f === "ALL" ? t("common.all") : t(statusKey(f))}
                </button>
              ))}
            </div>

            <ul className="mt-6 space-y-3">
              {visible.map((app) => (
                <li key={app.id} className="surface rounded-xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/jobs/${app.job?.id ?? ""}`}
                        className="font-display text-lg font-bold text-text transition hover:text-brand"
                      >
                        {app.job?.title ?? t("apps.opening")}
                      </Link>
                      <p className="mt-1.5 text-sm text-muted">
                        {app.job?.companyName ?? t("role.company")} -{" "}
                        {t(cityKey(app.job?.location))}
                        {app.job?.type
                          ? ` - ${t(jobTypeKey(app.job.type))}`
                          : ""}
                      </p>
                    </div>
                    <span className={`badge ${STATUS_BADGES[app.status]}`}>
                      {t(statusKey(app.status))}
                    </span>
                  </div>

                  {app.coverLetter && (
                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">
                      {app.coverLetter}
                    </p>
                  )}

                  {app.companyNote && (
                    <div className="mt-4 rounded-lg border border-line bg-panel-2 px-4 py-3">
                      <p className="text-xs font-medium text-brand">
                        {t("apps.companyNote")}
                      </p>
                      <p className="mt-1.5 text-sm text-muted">
                        {app.companyNote}
                      </p>
                    </div>
                  )}

                  <div className="rule my-5" />

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
                    <span>
                      {t("apps.sentOn", { date: formatDate(app.createdAt) })}
                    </span>
                    {app.respondedAt && (
                      <span>
                        {t("apps.respondedOn", {
                          date: formatDate(app.respondedAt),
                        })}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {visible.length === 0 && (
              <div className="surface mt-6 rounded-xl px-8 py-14 text-center">
                <p className="text-sm text-muted">
                  {t("apps.noneWithStatus")}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
