"use client";

import Link from "next/link";
import Particles from "@/components/particles";
import Logo from "@/components/logo";
import CompanyStrip from "@/components/company-strip";
import BuiltAtWahj from "@/components/built-at-wahj";
import LanguageToggle from "@/components/language-toggle";
import { useT } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

const cities: { name: string; key: TranslationKey; roles: number }[] = [
  { name: "Ramallah", key: "city.ramallah", roles: 5 },
  { name: "Nablus", key: "city.nablus", roles: 3 },
  { name: "Hebron", key: "city.hebron", roles: 4 },
  { name: "Rawabi", key: "city.rawabi", roles: 3 },
];

const stages: { name: TranslationKey; badge: string; note: TranslationKey }[] = [
  { name: "status.submitted", badge: "badge-neutral", note: "home.stage.submitted" },
  { name: "status.reviewing", badge: "badge-warn", note: "home.stage.reviewing" },
  { name: "status.accepted", badge: "badge-success", note: "home.stage.accepted" },
  { name: "status.rejected", badge: "badge-danger", note: "home.stage.rejected" },
];

const openings: {
  title: string;
  org: string;
  place: TranslationKey;
  type: TranslationKey;
  intern: boolean;
}[] = [
  { title: "Senior Frontend Engineer", org: "Harri", place: "city.ramallah", type: "jobType.fullTime", intern: false },
  { title: "R&D Engineering Intern", org: "ASAL Technologies", place: "city.rawabi", type: "jobType.internship", intern: true },
  { title: "UI/UX Designer", org: "Wahj", place: "city.hebron", type: "jobType.partTime", intern: false },
  { title: "Backend Engineer", org: "Foothill", place: "city.nablus", type: "jobType.fullTime", intern: false },
];

export default function Home() {
  const t = useT();

  return (
    <div className="relative overflow-hidden">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            <LanguageToggle className="me-2" />
            <Link
              href="/jobs"
              className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-text"
            >
              {t("nav.openings")}
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-text"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/register"
              className="btn-primary ml-2 rounded-lg px-5 py-2 text-sm font-semibold"
            >
              {t("nav.getStarted")}
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative z-20 border-b border-line-soft bg-panel-2/60">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-2.5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
          <p className="text-center text-xs text-muted">
            <span className="font-semibold text-text">
              {t("demo.label")}
            </span>{" "}
            {t("demo.body")}
          </p>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-line-soft">
        <Particles />
        <div className="grid-lines" />
        <div className="glow" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-20 text-center sm:pt-24">
          <span className="badge badge-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t("home.badge")}
          </span>

          <h1 className="mt-7 font-display text-5xl font-bold leading-[1.06] tracking-tight text-text sm:text-6xl">
            {t("home.title.a")}
            <br />
            {t("home.title.b")}{" "}
            <span className="text-brand">{t("home.title.person")}</span>
            {t("home.title.end")}
          </h1>

          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted">
            {t("home.lede")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="btn-primary rounded-lg px-7 py-3 font-semibold"
            >
              {t("common.createAccount")}
            </Link>
            <Link
              href="/jobs"
              className="btn-ghost rounded-lg px-7 py-3 font-semibold"
            >
              {t("common.browseOpenings")}
            </Link>
          </div>
        </div>

        <div className="relative z-10 pb-12 pt-16">
          <CompanyStrip />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6">
        <section className="border-b border-line-soft py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="font-display text-3xl font-bold leading-tight text-text">
                {t("home.cities.title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {t("home.cities.body")}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.name}
                    href={`/jobs?location=${city.name}`}
                    className="surface surface-hover rounded-lg px-4 py-3"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-text">
                        {t(city.key)}
                      </span>
                      <span className="text-sm font-semibold text-brand">
                        {city.roles}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {openings.map((job) => (
                <Link
                  key={job.title}
                  href="/jobs"
                  className="surface surface-hover flex flex-wrap items-center justify-between gap-3 rounded-lg px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {job.title}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {job.org} - {t(job.place)}
                    </p>
                  </div>
                  <span
                    className={
                      job.intern ? "badge badge-brand" : "badge badge-neutral"
                    }
                  >
                    {t(job.type)}
                  </span>
                </Link>
              ))}

              <Link
                href="/jobs"
                className="block pt-2 text-sm font-semibold text-brand underline underline-offset-8 transition hover:text-brand-soft"
              >
                {t("home.seeAll")}
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-line-soft py-16">
          <h2 className="font-display text-3xl font-bold leading-tight text-text">
            {t("home.stages.title")}
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted">
            {t("home.stages.body")}
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage) => (
              <div key={stage.name} className="bg-panel p-6">
                <span className={`badge ${stage.badge}`}>{t(stage.name)}</span>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {t(stage.note)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="surface relative overflow-hidden rounded-2xl px-8 py-14 text-center">
            <div className="glow" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold text-text">
                {t("home.pick.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
                {t("home.pick.body")}
              </p>
              <Link
                href="/register"
                className="btn-primary mt-8 inline-block rounded-lg px-8 py-3 font-semibold"
              >
                {t("common.createAccount")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <BuiltAtWahj />

      <div className="border-b border-line-soft py-10">
        <div className="mx-auto max-w-lg px-6">
          <div className="surface relative overflow-hidden rounded-xl border-brand/20 px-6 py-5 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand-soft/5" />
            <div className="relative z-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                {t("credit.label")}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <span className="font-display text-lg font-bold text-text">
                  Hosam Tarade
                </span>
                <span className="text-sm font-light text-brand/50">
                  &times;
                </span>
                <span className="font-display text-lg font-bold text-text">
                  Mohammed Tarade
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-line-soft py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <Logo />
          <p className="text-sm text-muted/70">NestJS - PostgreSQL - Next.js</p>
        </div>
      </footer>
    </div>
  );
}