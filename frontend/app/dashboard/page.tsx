"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { listMyJobs } from "@/lib/jobs";
import Logo from "@/components/logo";

const candidateNav = [
  { label: "Overview", href: "/dashboard", ready: true },
  { label: "Browse jobs", href: "/jobs", ready: true },
  { label: "My applications", href: "#", ready: false },
  { label: "Profile", href: "#", ready: false },
];

const companyNav = [
  { label: "Overview", href: "/dashboard", ready: true },
  { label: "My postings", href: "/dashboard/jobs", ready: true },
  { label: "Company profile", href: "/dashboard/company", ready: true },
  { label: "Applicants", href: "#", ready: false },
];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [totalJobs, setTotalJobs] = useState<number | null>(null);
  const [liveJobs, setLiveJobs] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "COMPANY") return;
    listMyJobs()
      .then((jobs) => {
        setTotalJobs(jobs.length);
        setLiveJobs(jobs.filter((j) => j.isActive).length);
      })
      .catch(() => {
        setTotalJobs(0);
        setLiveJobs(0);
      });
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

  const show = (n: number | null) => (n === null ? "-" : String(n));

  const stats = isCandidate
    ? [
        { label: "Applications sent", value: "-" },
        { label: "Under review", value: "-" },
        { label: "Accepted", value: "-" },
        { label: "Saved jobs", value: "-" },
      ]
    : [
        { label: "Total postings", value: show(totalJobs) },
        { label: "Live postings", value: show(liveJobs) },
        { label: "Total applicants", value: "-" },
        { label: "Awaiting review", value: "-" },
      ];

  const stages = [
    { name: "Submitted", badge: "badge-neutral" },
    { name: "Reviewing", badge: "badge-warn" },
    { name: "Accepted", badge: "badge-success" },
    { name: "Rejected", badge: "badge-danger" },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="glow" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-panel p-6 lg:flex">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="mt-10 space-y-1">
            {nav.map((item, i) =>
              item.ready ? (
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
              ) : (
                <span
                  key={item.label}
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted/45"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-line" />
                  {item.label}
                  <span className="ml-auto text-[10px] text-muted/35">Soon</span>
                </span>
              ),
            )}
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
              {stats.map((s) => (
                <div key={s.label} className="bg-panel p-6">
                  <p className="text-sm text-muted">{s.label}</p>
                  <p className="mt-3 font-display text-3xl font-bold text-text">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <section className="surface mt-5 rounded-xl p-7">
              <h2 className="text-sm font-semibold text-brand">
                Application pipeline
              </h2>
              <p className="mt-2 text-sm text-muted">
                Available once the applications module is added.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {stages.map((stage) => (
                  <span key={stage.name} className={`badge ${stage.badge}`}>
                    {stage.name}
                  </span>
                ))}
              </div>
            </section>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <section className="surface rounded-xl p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-brand">
                    Recent activity
                  </h2>
                  <span className="text-xs text-muted">Last 30 days</span>
                </div>

                <div className="mt-10 flex flex-col items-center py-8 text-center">
                                    <span className="tile h-12 w-12">
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                      <path
                        d="M4 6h16M4 12h10M4 18h7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <p className="mt-6 font-semibold text-text">
                    Nothing here yet
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-muted">
                    {isCandidate
                      ? "Once you apply to an opening, it will show up here."
                      : "Once candidates apply to your roles, they will show up here."}
                  </p>
                  <Link
                    href={isCandidate ? "/jobs" : "/dashboard/jobs"}
                    className="btn-primary mt-7 rounded-lg px-6 py-2.5 text-sm font-semibold"
                  >
                    {isCandidate ? "Browse openings" : "Manage postings"}
                  </Link>
                </div>
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

                {!isCandidate && (
                  <>
                    <div className="rule my-6" />
                    <Link
                      href="/dashboard/company"
                      className="text-sm font-medium text-brand underline underline-offset-4 transition hover:text-brand-soft"
                    >
                      Edit company profile
                    </Link>
                  </>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
