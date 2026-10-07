"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { listMyJobs } from "@/lib/jobs";
import { getMyCompany } from "@/lib/companies";
import {
  companyApplicationStats,
  myApplicationStats,
} from "@/lib/applications";
import {
  ApplicationStatus,
  Company,
  StatusCounts,
  STATUS_BADGES,
} from "@/lib/types";
import { useT } from "@/lib/i18n/context";
import { statusKey } from "@/lib/i18n/dictionaries";

const STAGES: ApplicationStatus[] = [
  "SUBMITTED",
  "REVIEWING",
  "ACCEPTED",
  "REJECTED",
];

export default function DashboardPage() {
  const t = useT();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [totalJobs, setTotalJobs] = useState<number | null>(null);
  const [liveJobs, setLiveJobs] = useState<number | null>(null);
  const [stats, setStats] = useState<StatusCounts | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    if (user.role === "COMPANY") {
      listMyJobs()
        .then((jobs) => {
          setTotalJobs(jobs.length);
          setLiveJobs(jobs.filter((j) => j.isActive).length);
        })
        .catch(() => {
          setTotalJobs(0);
          setLiveJobs(0);
        });

      companyApplicationStats()
        .then(setStats)
        .catch(() => setStats(null));

      getMyCompany()
        .then(setCompany)
        .catch(() => setCompany(null));
    } else {
      myApplicationStats()
        .then(setStats)
        .catch(() => setStats(null));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">{t("common.loading")}</p>
      </div>
    );
  }

  if (!user) return null;

  const isCandidate = user.role === "CANDIDATE";

  const show = (n: number | null | undefined) =>
    n === null || n === undefined ? "-" : String(n);

  const totalApplications = stats
    ? STAGES.reduce((sum, s) => sum + (stats[s] ?? 0), 0)
    : null;

  const cards = isCandidate
    ? [
        { label: t("dash.applicationsSent"), value: show(totalApplications) },
        { label: t("dash.underReview"), value: show(stats?.REVIEWING) },
        { label: t("status.accepted"), value: show(stats?.ACCEPTED) },
        { label: t("status.rejected"), value: show(stats?.REJECTED) },
      ]
    : [
        { label: t("dash.totalPostings"), value: show(totalJobs) },
        { label: t("dash.livePostings"), value: show(liveJobs) },
        { label: t("dash.totalApplicants"), value: show(totalApplications) },
        { label: t("dash.awaitingReview"), value: show(stats?.SUBMITTED) },
      ];

  const pipelineTotal = totalApplications ?? 0;

  const rate = company?.responseRate ?? null;
  const rateTone =
    rate === null
      ? "text-muted"
      : rate >= 70
        ? "text-success"
        : rate >= 40
          ? "text-brand"
          : "text-text";

  return (
    <>
      <header className="flex items-center justify-between border-b border-line px-6 py-5 lg:px-10">
        <div>
          <p className="text-sm text-muted">
            {isCandidate ? t("dash.candidateSpace") : t("dash.companySpace")}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-text">
            {user.fullName}
          </h1>
        </div>
        <button
          onClick={logout}
          className="btn-ghost rounded-lg px-4 py-2 text-sm lg:hidden"
        >
          {t("common.signOut")}
        </button>
      </header>

      <main className="px-6 py-8 lg:px-10">
        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-panel p-6">
              <p className="text-sm text-muted">{c.label}</p>
              <p className="mt-3 font-display text-3xl font-bold text-text">
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {!isCandidate && company && (
          <section className="surface mt-5 rounded-xl p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-brand">
                {t("dash.scoreTitle")}
              </h2>
              {company.responseIsPublic ? (
                <span className="badge badge-success">
                  {t("dash.scoreShown")}
                </span>
              ) : (
                <span className="badge badge-neutral">{t("dash.scoreHidden")}</span>
              )}
            </div>

            {rate === null ? (
              <p className="mt-4 text-sm text-muted">
                {t("dash.scoreEmpty")}
              </p>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap items-end gap-10">
                  <div>
                    <p
                      className={`font-display text-4xl font-bold tabular-nums ${rateTone}`}
                    >
                      {rate}%
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {t("dash.scoreReplied")}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-4xl font-bold tabular-nums text-text">
                      {company.avgResponseDays ?? "-"}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {t("dash.scoreDays")}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-4xl font-bold tabular-nums text-text">
                      {company.responseSampleSize}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {t("dash.scoreMeasured")}
                    </p>
                  </div>
                </div>

                <div className="rule my-7" />

                <p className="text-sm text-muted">
                  {company.responseIsPublic
                    ? t("dash.scoreNotePublic")
                    : t("dash.scoreNoteHidden", {
                        count: 10 - company.responseSampleSize,
                      })}
                </p>
              </>
            )}
          </section>
        )}

        <section className="surface mt-5 rounded-xl p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-brand">
              {t("dash.pipeline")}
            </h2>
            <Link
              href={
                isCandidate
                  ? "/dashboard/applications"
                  : "/dashboard/applicants"
              }
              className="text-xs text-muted underline underline-offset-4 transition hover:text-text"
            >
              {isCandidate ? t("dash.viewApplications") : t("dash.reviewApplicants")}
            </Link>
          </div>

          {pipelineTotal === 0 ? (
            <p className="mt-4 text-sm text-muted">
              {isCandidate
                ? t("dash.pipelineEmptyCandidate")
                : t("dash.pipelineEmptyCompany")}
            </p>
          ) : (
            <>
              <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-line">
                {STAGES.map((s) => {
                  const value = stats?.[s] ?? 0;
                  if (value === 0) return null;
                  const width = (value / pipelineTotal) * 100;
                  const color =
                    s === "ACCEPTED"
                      ? "bg-success"
                      : s === "REJECTED"
                        ? "bg-danger"
                        : s === "REVIEWING"
                          ? "bg-warn"
                          : "bg-muted";
                  return (
                    <span
                      key={s}
                      className={color}
                      style={{ width: `${width}%` }}
                    />
                  );
                })}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {STAGES.map((s) => (
                  <div key={s}>
                    <span className={`badge ${STATUS_BADGES[s]}`}>
                      {t(statusKey(s))}
                    </span>
                    <p className="mt-2 font-display text-2xl font-bold text-text">
                      {stats?.[s] ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <section className="surface rounded-xl p-7">
            <h2 className="text-sm font-semibold text-brand">
              {isCandidate ? t("dash.nextStep") : t("dash.quickActions")}
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {isCandidate ? (
                <>
                  <Link
                    href="/dashboard/browse"
                    className="btn-primary rounded-lg px-6 py-3 text-sm font-semibold"
                  >
                    {t("common.browseOpenings")}
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="btn-ghost rounded-lg px-6 py-3 text-sm font-semibold"
                  >
                    {t("dash.editProfile")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/jobs"
                    className="btn-primary rounded-lg px-6 py-3 text-sm font-semibold"
                  >
                    {t("dash.managePostings")}
                  </Link>
                  <Link
                    href="/dashboard/applicants"
                    className="btn-ghost rounded-lg px-6 py-3 text-sm font-semibold"
                  >
                    {t("dash.reviewApplicants")}
                  </Link>
                </>
              )}
            </div>

            <div className="rule my-7" />

            <p className="text-sm text-muted">
              {isCandidate
                ? t("dash.tipCandidate")
                : t("dash.tipCompany")}
            </p>
          </section>

          <section className="surface rounded-xl p-7">
            <h2 className="text-sm font-semibold text-brand">
              {t("dash.account")}
            </h2>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="text-muted">
                  {isCandidate ? t("auth.fullName") : t("auth.companyName")}
                </dt>
                <dd className="mt-1 text-text">{user.fullName}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("auth.email")}</dt>
                <dd className="mt-1 break-all text-text">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted">{t("dash.accountType")}</dt>
                <dd className="mt-1 font-semibold text-brand-soft">
                  {isCandidate ? t("role.candidate") : t("role.company")}
                </dd>
              </div>
            </dl>

            <div className="rule my-6" />
            <Link
              href={isCandidate ? "/dashboard/profile" : "/dashboard/company"}
              className="text-sm font-medium text-brand underline underline-offset-4 transition hover:text-brand-soft"
            >
              {isCandidate ? t("dash.editYourProfile") : t("dash.editCompany")}
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}