"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { listMyJobs } from "@/lib/jobs";

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
        <p className="text-fog">Loading</p>
      </div>
    );
  }

  if (!user) return null;

  const isCandidate = user.role === "CANDIDATE";
  const nav = isCandidate ? candidateNav : companyNav;
  const accent = isCandidate ? "text-cyan" : "text-magenta";
  const dot = isCandidate ? "bg-cyan" : "bg-magenta";
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

  const stages = ["Submitted", "Reviewing", "Accepted", "Rejected"];

  return (
    <div className="relative min-h-screen">
      <div className="aura" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface/60 p-6 lg:flex">
          <Link href="/" className="font-display text-2xl font-bold text-chalk">
            Job<span className="text-cyan">.</span>Platform
          </Link>

          <nav className="mt-10 space-y-1">
            {nav.map((item, i) =>
              item.ready ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    i === 0
                      ? "flex w-full items-center gap-3 rounded-lg bg-surface-2 px-3 py-2.5 text-sm font-semibold text-chalk"
                      : "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fog transition hover:bg-surface-2/60 hover:text-chalk"
                  }
                >
                  <span
                    className={
                      i === 0
                        ? `h-1.5 w-1.5 rounded-full ${dot}`
                        : "h-1.5 w-1.5 rounded-full bg-line"
                    }
                  />
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fog/40"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-line" />
                  {item.label}
                  <span className="ml-auto text-[10px] text-fog/30">Soon</span>
                </span>
              ),
            )}
          </nav>

          <div className="mt-auto border-t border-line pt-6">
            <div className="flex items-center gap-3">
              <span
                className={
                  isCandidate
                    ? "tile tile-cyan h-9 w-9 rounded-lg font-display text-xs font-bold"
                    : "tile tile-magenta h-9 w-9 rounded-lg font-display text-xs font-bold"
                }
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm text-chalk">{user.fullName}</p>
                <p className={`text-xs ${accent}`}>
                  {isCandidate ? "Candidate" : "Company"}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-4 w-full rounded-lg border border-line py-2 text-sm text-fog transition hover:border-cyan/50 hover:text-chalk"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-hidden">
          <header className="flex items-center justify-between border-b border-line px-6 py-5 lg:px-10">
            <div>
              <p className="font-display text-xs tracking-[0.25em] text-fog">
                {isCandidate ? "CANDIDATE WORKSPACE" : "COMPANY WORKSPACE"}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-chalk">
                {user.fullName}
              </h1>
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-line px-4 py-2 text-sm text-fog transition hover:text-chalk lg:hidden"
            >
              Sign out
            </button>
          </header>

          <main className="px-6 py-8 lg:px-10">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface p-6">
                  <p className="text-sm text-fog">{s.label}</p>
                  <p className="mt-3 font-display text-4xl font-bold text-chalk">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <section className="card mt-5 rounded-2xl p-7">
              <h2 className="font-display text-sm font-bold tracking-wider text-cyan">
                APPLICATION PIPELINE
              </h2>
              <p className="mt-2 text-sm text-fog">
                Available once the applications module is added.
              </p>

              <div className="mt-8 flex gap-2">
                {stages.map((stage) => (
                  <div key={stage} className="flex-1">
                    <div className="h-1 rounded-full bg-line" />
                    <p className="mt-3 text-xs text-fog">{stage}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-fog/30">
                      -
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <section className="card rounded-2xl p-7">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold tracking-wider text-cyan">
                    RECENT ACTIVITY
                  </h2>
                  <span className="text-xs text-fog">Last 30 days</span>
                </div>

                <div className="mt-10 flex flex-col items-center py-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line">
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                  </span>
                  <p className="mt-6 font-display font-bold text-chalk">
                    Nothing here yet
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-fog">
                    {isCandidate
                      ? "Once you apply to an opening, it will show up here."
                      : "Once candidates apply to your roles, they will show up here."}
                  </p>
                  <Link
                    href={isCandidate ? "/jobs" : "/dashboard/jobs"}
                    className="btn-glow mt-7 rounded-xl bg-cyan px-6 py-3 text-sm font-bold text-void"
                  >
                    {isCandidate ? "Browse openings" : "Manage postings"}
                  </Link>
                </div>
              </section>

              <section className="card rounded-2xl p-7">
                <h2 className="font-display text-sm font-bold tracking-wider text-cyan">
                  ACCOUNT
                </h2>
                <dl className="mt-6 space-y-5 text-sm">
                  <div>
                    <dt className="text-fog">
                      {isCandidate ? "Full name" : "Company name"}
                    </dt>
                    <dd className="mt-1 text-chalk">{user.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-fog">Email</dt>
                    <dd className="mt-1 break-all text-chalk">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-fog">Account type</dt>
                    <dd className={`mt-1 font-semibold ${accent}`}>
                      {isCandidate ? "Candidate" : "Company"}
                    </dd>
                  </div>
                </dl>

                {!isCandidate && (
                  <>
                    <div className="beam my-6" />
                    <Link
                      href="/dashboard/company"
                      className="text-sm text-cyan underline underline-offset-4 transition hover:text-chalk"
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
