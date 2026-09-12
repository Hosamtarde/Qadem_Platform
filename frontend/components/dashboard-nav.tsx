"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/logo";

const candidateNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Browse jobs", href: "/dashboard/browse" },
  { label: "My applications", href: "/dashboard/applications" },
  { label: "Profile", href: "/dashboard/profile" },
];

const companyNav = [
  { label: "Overview", href: "/dashboard" },
  { label: "My postings", href: "/dashboard/jobs" },
  { label: "Applicants", href: "/dashboard/applicants" },
  { label: "Company profile", href: "/dashboard/company" },
];

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isCandidate = user.role === "CANDIDATE";
  const nav = isCandidate ? candidateNav : companyNav;
  const initials = user.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-panel p-6 lg:flex">
      <Link href="/">
        <Logo />
      </Link>

      <nav className="mt-10 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex w-full items-center gap-3 rounded-lg bg-panel-2 px-3 py-2.5 text-sm font-semibold text-text"
                  : "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition hover:bg-panel-2 hover:text-text"
              }
            >
              <span
                className={
                  active
                    ? "h-1.5 w-1.5 rounded-full bg-brand"
                    : "h-1.5 w-1.5 rounded-full bg-line"
                }
              />
              {item.label}
            </Link>
          );
        })}
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
  );
}
