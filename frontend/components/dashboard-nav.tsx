"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/logo";
import NotificationBell from "@/components/notification-bell";
import LanguageToggle from "@/components/language-toggle";
import { useT } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const candidateNav: { key: TranslationKey; href: string }[] = [
  { key: "nav.overview", href: "/dashboard" },
  { key: "nav.browse", href: "/dashboard/browse" },
  { key: "nav.myApplications", href: "/dashboard/applications" },
  { key: "nav.invitations", href: "/dashboard/invitations" },
  { key: "nav.profile", href: "/dashboard/profile" },
];

const companyNav: { key: TranslationKey; href: string }[] = [
  { key: "nav.overview", href: "/dashboard" },
  { key: "nav.myPostings", href: "/dashboard/jobs" },
  { key: "nav.findTalent", href: "/dashboard/talent" },
  { key: "nav.applicants", href: "/dashboard/applicants" },
  { key: "nav.companyProfile", href: "/dashboard/company" },
];

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const isCandidate = user.role === "CANDIDATE";
  const nav = isCandidate ? candidateNav : companyNav;
  const initials = user.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-panel/80 backdrop-blur-xl">
      <div className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-8">
        {/* Far left */}
        <Link href="/" className="justify-self-start">
          <Logo />
        </Link>

        {/* Center — glowing underline indicator */}
        <nav className="hidden h-full items-center gap-9 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex h-full items-center"
              >
                <span className="pointer-events-none absolute -inset-x-4 inset-y-4 rounded-xl bg-brand/0 blur-md transition-all duration-300 group-hover:bg-brand/20" />

                <span
                  className={
                    active
                      ? "relative text-[15px] font-semibold tracking-tight text-text"
                      : "relative text-[15px] font-medium tracking-tight text-muted transition-colors duration-200 group-hover:text-brand group-hover:[text-shadow:0_0_14px_rgba(46,116,181,0.65)]"
                  }
                >
                  {t(item.key)}
                </span>

                <span
                  className={
                    active
                      ? "absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-brand shadow-[0_0_12px_rgba(46,116,181,0.7)]"
                      : "absolute inset-x-0 bottom-0 h-[2px] scale-x-0 rounded-full bg-brand opacity-0 shadow-[0_0_10px_rgba(46,116,181,0.6)] transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
                  }
                />
              </Link>
            );
          })}
        </nav>

        {/* Far right */}
        <div className="flex items-center gap-2.5 justify-self-end">
          <LanguageToggle className="hidden sm:inline-flex" />

          <NotificationBell />

          <span className="hidden h-6 w-px bg-line sm:block" />

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-full py-1 ps-1 pe-2.5 transition hover:bg-panel-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand ring-1 ring-brand/25">
                {initials}
              </span>
              <span className="hidden text-start lg:block">
                <span className="block max-w-32 truncate text-sm font-medium leading-tight text-text">
                  {user.fullName}
                </span>
                <span className="block text-[11px] leading-tight text-brand-soft">
                  {isCandidate ? t("role.candidate") : t("role.company")}
                </span>
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={
                  menuOpen
                    ? "hidden rotate-180 text-muted transition sm:block"
                    : "hidden text-muted transition sm:block"
                }
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute end-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl">
                  <div className="border-b border-line px-4 py-3.5">
                    <p className="truncate text-sm font-semibold text-text">
                      {user.fullName}
                    </p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>

                  <div className="border-b border-line py-1 md:hidden">
                    {nav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={
                          pathname === item.href
                            ? "block px-4 py-3 text-sm font-semibold text-text"
                            : "block px-4 py-3 text-sm text-muted transition hover:bg-panel-2 hover:text-text"
                        }
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                  </div>

                  <button
                    onClick={logout}
                    className="w-full px-4 py-3.5 text-start text-sm text-muted transition hover:bg-panel-2 hover:text-text"
                  >
                    {t("common.signOut")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}