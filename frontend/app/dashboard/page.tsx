"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { listMyJobs } from "@/lib/jobs";
import {
  companyApplicationStats,
  myApplicationStats,
} from "@/lib/applications";
import {
  ApplicationStatus,
  StatusCounts,
  STATUS_BADGES,
  STATUS_LABELS,
} from "@/lib/types";
import Logo from "@/components/logo";

const candidateNav = [
  { label: "Overview", href: "/dashboard", ready: true },
  { label: "Browse jobs", href: "/jobs", ready: true },
  { label: "My applications", href: "/dashboard/applications", ready: true },
  { label: "Profile", href: "/dashboard/profile", ready: true },
];

const companyNav = [
  { label: "Overview", href: "/dashboard", ready: true },
  { label: "My postings", href: "/dashboard/jobs", ready: true },
  { label: "Applicants", href: "/dashboard/applicants", ready: true },
  { label: "Company profile", href: "/dashboard/company", ready: true },
];

const STAGES: ApplicationStatus[] = [
  "SUBMITTED",
  "REVIEWING",
  "ACCEPTED",
  "REJECTED",
];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [totalJobs, setTotalJobs] = useState<number | null>(null);
  const [liveJobs, setLiveJobs] = useState<number | null>(null);
  const [stats, setStats] = useState<StatusCounts | null>(null);

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
    } else {
      myApplicationStats()
        .then(setStats)
        .catch(() => setStats(null));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading</p>
      </div>
    );
  }

  if (!user) return null;

  const isCandidate = user.role === "CANDIDATE";
  const nav = isCandidate ? candidateNav : companyNav;
  const initials = user.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const show = (n: number | null | undefined) =>
    n === null || n === undefined ? "-" : String(n);

  const totalApplications = stats
    ? STAGES.reduce((sum, s) => sum + (stats[s] ?? 0), 0)
    : null;

  const cards = isCandidate
    ? [
        { label: "Applications sent", value: show(totalApplications) },
        { label: "Under review", value: show(stats?.REVIEWING) },
        { label: "Accepted", value: show(stats?.ACCEPTED) },
        { label: "Rejected", value: show(stats?.REJECTED) },
      ]
    : [
        { label: "Total postings", value: show(totalJobs) },
        { label: "Live postings", value: show(liveJobs) },
        { label: "Total applicants", value: show(totalApplications) },
        { label: "Awaiting review", value: show(stats?.SUBMITTED) },
      ];

  const pipelineTotal = totalApplications ?? 0;

  return (
    <div className="relative min-h-screen">
      <div className="glow" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-panel p-6 lg:flex">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="mt-10 space-y-1">
            {nav.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className={
                  i === 0
                    ? "flex w-full items-center gap-3 rounded-lg bg-panel-2 px-3 py-2.5 text-sm font-semibold text-text"
                    : "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition hover:bg-panel-2 hover:text-text"
                }
              >
                <span
                  className={
                    i === 0
                      ? "h-1.5 w-1.5 rounded-full bg-brand"
                      : "h-1.5 w-1.5 rounded-full bg-line"
                  }
                />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-line pt-6">
            <div className="flex items-center gap-3">
              <span className="tile h-9 w-9 rounded-lg text-xs font-semibold">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-text">{user.fullName}</p>
                <p className="text-xs text-brand-soft">
                  {isCandidate ? "Candidate" : "Company"}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn-ghost mt-4 w-full rounded-lg py-2 text-sm"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-hidden">
          <header className="flex items-center justify-between border-b border-line px-6 py-5 lg:px-10">
            <div>
              <p className="text-sm text-muted">
                {isCandidate ? "Candidate workspace" : "Company workspace"}
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold text-text">
                {user.fullName}
              </h1>
            </div>
            <button
              onClick={logout}
              className="btn-ghost rounded-lg px-4 py-2 text-sm lg:hidden"
            >
              Sign out
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

            <section className="surface mt-5 rounded-xl p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-brand">
                  Application pipeline
                </h2>
                <Link
                  href={
                    isCandidate
                      ? "/dashboard/applications"
                      : "/dashboard/applicants"
                  }
                  className="text-xs text-muted underline underline-offset-4 transition hover:text-text"
                >
                  {isCandidate ? "View applications" : "Review applicants"}
                </Link>
              </div>

              {pipelineTotal === 0 ? (
                <p className="mt-4 text-sm text-muted">
                  {isCandidate
                    ? "Nothing sent yet. Your applications will appear here."
                    : "No applications yet. They will appear here once candidates apply."}
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
                          {STATUS_LABELS[s]}
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
                  {isCandidate ? "Next step" : "Quick actions"}
                </h2>

                <div className="mt-6 flex flex-wrap gap-3">
                  {isCandidate ? (
                    <>
                      <Link
                        href="/jobs"
                        className="btn-primary rounded-lg px-6 py-3 text-sm font-semibold"
                      >
                        Browse openings
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="btn-ghost rounded-lg px-6 py-3 text-sm font-semibold"
                      >
                        Edit profile
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/dashboard/jobs"
                        className="btn-primary rounded-lg px-6 py-3 text-sm font-semibold"
                      >
                        Manage postings
                      </Link>
                      <Link
                        href="/dashboard/applicants"
                        className="btn-ghost rounded-lg px-6 py-3 text-sm font-semibold"
                      >
                        Review applicants
                      </Link>
                    </>
                  )}
                </div>

                <div className="rule my-7" />

                <p className="text-sm text-muted">
                  {isCandidate
                    ? "A complete profile with a resume gets read more often than one without."
                    : "Applications you leave in Submitted are the ones candidates are still waiting on."}
                </p>
              </section>

              <section className="surface rounded-xl p-7">
                <h2 className="text-sm font-semibold text-brand">Account</h2>
                <dl className="mt-6 space-y-5 text-sm">
                  <div>
                    <dt className="text-muted">
                      {isCandidate ? "Full name" : "Company name"}
                    </dt>
                    <dd className="mt-1 text-text">{user.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Email</dt>
                    <dd className="mt-1 break-all text-text">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Account type</dt>
                    <dd className="mt-1 font-semibold text-brand-soft">
                      {isCandidate ? "Candidate" : "Company"}
                    </dd>
                  </div>
                </dl>

                <div className="rule my-6" />
                <Link
                  href={
                    isCandidate ? "/dashboard/profile" : "/dashboard/company"
                  }
                  className="text-sm font-medium text-brand underline underline-offset-4 transition hover:text-brand-soft"
                >
                  {isCandidate ? "Edit your profile" : "Edit company profile"}
                </Link>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
