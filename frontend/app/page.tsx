import Link from "next/link";
import Particles from "@/components/particles";
import Logo from "@/components/logo";
import CompanyStrip from "@/components/company-strip";

const cities = [
  { name: "Ramallah", roles: 5 },
  { name: "Nablus", roles: 3 },
  { name: "Hebron", roles: 4 },
  { name: "Rawabi", roles: 3 },
];

const stages = [
  { name: "Submitted", badge: "badge-neutral", note: "Reaches the company the moment you send it." },
  { name: "Reviewing", badge: "badge-warn", note: "They opened it and are going through your details." },
  { name: "Accepted", badge: "badge-success", note: "You moved forward. They will reach out." },
  { name: "Rejected", badge: "badge-danger", note: "Not this time. At least you are not guessing." },
];

const openings = [
  { title: "Senior Frontend Engineer", org: "Harri", place: "Ramallah", type: "Full-time", intern: false },
  { title: "R&D Engineering Intern", org: "ASAL Technologies", place: "Rawabi", type: "Internship", intern: true },
  { title: "UI/UX Designer", org: "Wahj", place: "Hebron", type: "Part-time", intern: false },
  { title: "Backend Engineer", org: "Foothill", place: "Nablus", type: "Full-time", intern: false },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/jobs"
              className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-text"
            >
              Openings
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-text"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="btn-primary ml-2 rounded-lg px-5 py-2 text-sm font-semibold"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-line-soft">
        <Particles />
        <div className="grid-lines" />
        <div className="glow" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-20 text-center sm:pt-24">
          <span className="badge badge-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Jobs and internships in Palestine
          </span>

          <h1 className="mt-7 font-display text-5xl font-bold leading-[1.06] tracking-tight text-text sm:text-6xl">
            Find the role.
            <br />
            Or find the <span className="text-brand">person</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted">
            Companies publish openings. Candidates apply and follow every
            application from sent to decided.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="btn-primary rounded-lg px-7 py-3 font-semibold"
            >
              Create an account
            </Link>
            <Link
              href="/jobs"
              className="btn-ghost rounded-lg px-7 py-3 font-semibold"
            >
              Browse openings
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
                Hiring across Palestine
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Companies from four cities publish here. Browse without an
                account, and create one when you are ready to apply.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {cities.map((city) => (
                  <Link
                    key={city.name}
                    href="/jobs"
                    className="surface surface-hover rounded-lg px-4 py-3"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-text">
                        {city.name}
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
                      {job.org} - {job.place}
                    </p>
                  </div>
                  <span
                    className={
                      job.intern ? "badge badge-brand" : "badge badge-neutral"
                    }
                  >
                    {job.type}
                  </span>
                </Link>
              ))}

              <Link
                href="/jobs"
                className="block pt-2 text-sm font-semibold text-brand underline underline-offset-8 transition hover:text-brand-soft"
              >
                See all openings
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-line-soft py-16">
          <h2 className="font-display text-3xl font-bold leading-tight text-text">
            Every application carries a status
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted">
            Colour and label together, so the state is readable at a glance.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage) => (
              <div key={stage.name} className="bg-panel p-6">
                <span className={`badge ${stage.badge}`}>{stage.name}</span>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {stage.note}
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
                Pick your side
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
                Candidate or company. The platform adapts to whichever you
                choose.
              </p>
              <Link
                href="/register"
                className="btn-primary mt-8 inline-block rounded-lg px-8 py-3 font-semibold"
              >
                Create an account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line-soft py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <Logo />
          <p className="text-sm text-muted/70">NestJS - PostgreSQL - Next.js</p>
        </div>
      </footer>
    </div>
  );
}
