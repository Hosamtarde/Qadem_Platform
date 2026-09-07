"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

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

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

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
  const accent = isCandidate ? "text-jade" : "text-gold";
  const dot = isCandidate ? "bg-jade" : "bg-gold";
  const initials = user.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const stats = isCandidate
    ? [
        { label: "Applications sent", value: "0" },
        { label: "Under review", value: "0" },
        { label: "Accepted", value: "0" },
        { label: "Saved jobs", value: "0" },
      ]
    : [
        { label: "Open positions", value: "0" },
        { label: "Total applicants", value: "0" },
        { label: "Awaiting review", value: "0" },
        { label: "Hired", value: "0" },
      ];

  const stages = ["Submitted", "Reviewing", "Accepted", "Rejected"];

  return (
    <div className="relative min-h-screen">
      <div className="halo" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface/70 p-6 lg:flex">
          <span className="font-display text-2xl text-chalk">Job Platform</span>

          <nav className="mt-10 space-y-1">
            {nav.map((item, i) =>
              item.ready ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    i === 0
                      ? "flex w-full items-center gap-3 rounded-lg bg-surface-2 px-3 py-2.5 text-sm font-medium text-chalk"
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
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2 text-xs font-semibold text-chalk">
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
              className="mt-4 w-full rounded-lg border border-line py-2 text-sm text-fog transition hover:border-gold/50 hover:text-chalk"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-hidden">
          <header className="flex items-center justify-between border-b border-line px-6 py-5 lg:px-10">
            <div>
              <p className="text-sm text-fog">
                {isCandidate ? "Candidate workspace" : "Company workspace"}
              </p>
              <h1 className="mt-1 font-display text-3xl text-chalk">
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
            <div className="rise rise-1 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-surface/80 p-6">
                  <p className="text-sm text-fog">{s.label}</p>
                  <p className="mt-3 font-display text-4xl text-chalk">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <section className="rise rise-2 panel mt-6 rounded-xl p-7">
              <h2 className="text-sm font-medium text-chalk">
                Application pipeline
              </h2>
              <p className="mt-1 text-sm text-fog">
                {isCandidate
                  ? "Where your applications stand."
                  : "Where your applicants stand."}
              </p>

              <div className="mt-7 flex gap-1.5">
                {stages.map((stage) => (
                  <div key={stage} className="flex-1">
                    <div className="h-1.5 rounded-full bg-line" />
                    <p className="mt-3 text-xs text-fog">{stage}</p>
                    <p className="mt-1 font-display text-2xl text-chalk">0</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="rise rise-3 mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <section className="panel rounded-xl p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-chalk">
                    Recent activity
                  </h2>
                  <span className="text-xs text-fog">Last 30 days</span>
                </div>

                <div className="mt-10 flex flex-col items-center py-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line">
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                  </span>
                  <p className="mt-5 text-chalk">Nothing here yet</p>
                  <p className="mt-1 max-w-xs text-sm text-fog">
                    {isCandidate
                      ? "Once you apply to an opening, it will show up here."
                      : "Once you publish a role, applicants will show up here."}
                  </p>
                  <Link
                    href={isCandidate ? "/jobs" : "/dashboard/jobs"}
                    className="mt-6 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-night transition hover:bg-gold-soft"
                  >
                    {isCandidate ? "Browse openings" : "Publish a role"}
                  </Link>
                </div>
              </section>

              <section className="panel rounded-xl p-7">
                <h2 className="text-sm font-medium text-chalk">Account</h2>
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
                    <dd className={`mt-1 ${accent}`}>
                      {isCandidate ? "Candidate" : "Company"}
                    </dd>
                  </div>
                </dl>

                {!isCandidate && (
                  <>
                    <div className="hairline my-6" />
                    <Link
                      href="/dashboard/company"
                      className="text-sm text-gold-soft underline underline-offset-4"
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
