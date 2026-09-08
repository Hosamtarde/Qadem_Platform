import Link from "next/link";
import Particles from "@/components/particles";

const features = [
  {
    glyph: "01",
    title: "Post openings",
    body: "Publish a role in minutes. Set the type, location and salary range, then pause or reopen it whenever you need.",
    points: [
      "Full-time, part-time and internships",
      "Pause without losing applications",
      "Edit any detail at any time",
    ],
  },
  {
    glyph: "02",
    title: "Apply once",
    body: "Send an application and the platform records it. You cannot apply twice to the same role, so nothing gets duplicated.",
    points: [
      "One application per role",
      "Cover letter included",
      "Instant confirmation",
    ],
  },
  {
    glyph: "03",
    title: "Track status",
    body: "Every application carries a status that moves forward as the company reviews it. No silence after you hit send.",
    points: [
      "Submitted and reviewing",
      "Accepted or rejected",
      "Visible to both sides",
    ],
  },
];

const stages = [
  { name: "Submitted", badge: "badge-neutral", note: "Your application reaches the company the moment you send it." },
  { name: "Reviewing", badge: "badge-warn", note: "The company opens it and goes through your details." },
  { name: "Accepted", badge: "badge-success", note: "You moved forward. The company will reach out." },
  { name: "Rejected", badge: "badge-danger", note: "Not this time. At least you are not left guessing." },
];

const openings = [
  { title: "Senior Frontend Engineer", org: "Harri", place: "Ramallah", type: "Full-time", intern: false },
  { title: "R&D Engineering Intern", org: "ASAL Technologies", place: "Rawabi", type: "Internship", intern: true },
  { title: "UI/UX Designer", org: "Wahj", place: "Hebron", type: "Part-time", intern: false },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-display text-xl font-bold tracking-tight text-text">
            Qadem<span className="text-brand">.</span>
          </span>
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

        <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center sm:py-36">
          <span className="badge badge-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Jobs and internships in Palestine
          </span>

          <h1 className="mt-8 font-display text-5xl font-bold leading-[1.08] tracking-tight text-text sm:text-6xl">
            Find the role.
            <br />
            Or find the <span className="text-brand">person</span>.
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted">
            Companies publish openings. Candidates apply and follow every
            application from sent to decided, in one place.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="btn-primary rounded-lg px-7 py-3.5 font-semibold"
            >
              Create an account
            </Link>
            <Link
              href="/jobs"
              className="btn-ghost rounded-lg px-7 py-3.5 font-semibold"
            >
              Browse openings
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6">
        <section className="border-b border-line-soft py-24">
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight text-text sm:text-4xl">
            What both sides get
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="surface surface-hover rounded-xl p-7"
              >
                <div className="tile font-display text-sm font-bold">
                  {f.glyph}
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-text">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {f.body}
                </p>
                <div className="rule my-6" />
                <ul className="space-y-2.5">
                  {f.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2.5 text-sm text-muted"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-line-soft py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold leading-tight text-text sm:text-4xl">
                Real openings from Palestinian teams
              </h2>
              <p className="mt-5 leading-relaxed text-muted">
                Companies across Ramallah, Nablus, Hebron and Rawabi publish
                here. Browse without an account, and create one when you are
                ready to apply.
              </p>
              <Link
                href="/jobs"
                className="mt-7 inline-block text-sm font-semibold text-brand underline underline-offset-8 transition hover:text-brand-soft"
              >
                See all openings
              </Link>
            </div>

            <div className="space-y-3">
              {openings.map((job) => (
                <div
                  key={job.title}
                  className="surface surface-hover rounded-xl p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">{job.title}</p>
                      <p className="mt-1.5 text-sm text-muted">
                        {job.org} ? {job.place}
                      </p>
                    </div>
                    <span
                      className={
                        job.intern ? "badge badge-brand" : "badge badge-neutral"
                      }
                    >
                      {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line-soft py-24">
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight text-text sm:text-4xl">
            Every application carries a status
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            You always know where you stand. Colour and label together, so the
            state is readable at a glance.
          </p>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((stage) => (
              <div key={stage.name} className="bg-panel p-7">
                <span className={`badge ${stage.badge}`}>{stage.name}</span>
                <p className="mt-5 text-sm leading-relaxed text-muted">
                  {stage.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24">
          <div className="surface relative overflow-hidden rounded-2xl px-8 py-16 text-center">
            <div className="glow" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold text-text sm:text-4xl">
                Pick your side
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted">
                Candidate or company. You choose when you sign up, and the
                platform adapts to you.
              </p>
              <Link
                href="/register"
                className="btn-primary mt-9 inline-block rounded-lg px-8 py-3.5 font-semibold"
              >
                Create an account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line-soft py-9">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <span className="font-display font-bold text-text">
            Qadem<span className="text-brand">.</span>
          </span>
          <p className="text-sm text-muted/70">NestJS ? PostgreSQL ? Next.js</p>
        </div>
      </footer>
    </div>
  );
}
