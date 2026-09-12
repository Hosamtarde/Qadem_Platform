"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getMyCompany, updateMyCompany } from "@/lib/companies";
import { listMyJobs } from "@/lib/jobs";
import { ApiRequestError } from "@/lib/api";
import { Company, Job, JOB_TYPE_LABELS } from "@/lib/types";

export default function CompanyProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "COMPANY") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "COMPANY") return;
    Promise.all([getMyCompany(), listMyJobs().catch(() => [])])
      .then(([c, j]) => {
        setCompany(c);
        setJobs(j);
      })
      .catch(() => setError("Could not load your company profile."))
      .finally(() => setLoading(false));
  }, [user]);

  function startEditing() {
    if (!company) return;
    setName(company.name);
    setDescription(company.description ?? "");
    setWebsite(company.website ?? "");
    setLocation(company.location ?? "");
    setError("");
    setSaved(false);
    setEditing(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const updated = await updateMyCompany({
        name,
        description: description || undefined,
        website: website || undefined,
        location: location || undefined,
      });
      setCompany(updated);
      setEditing(false);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.messages.join(", "));
      } else {
        setError("Could not save your changes.");
      }
    } finally {
      setSaving(false);
    }
  }

  const field =
    "mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-text placeholder:text-muted/50 outline-none transition focus:border-brand";

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading</p>
      </div>
    );
  }

  const initials = company
    ? company.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
    : "";

  const liveJobs = jobs.filter((j) => j.isActive);
  const cleanUrl = company?.website
    ? company.website.replace(/^https?:\/\//, "")
    : "";

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 lg:px-10">
        <div>
          <p className="text-sm text-muted">Company workspace</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-text">
            Company profile
          </h1>
        </div>
        {!editing && (
          <button
            onClick={startEditing}
            className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold"
          >
            Edit profile
          </button>
        )}
      </header>

      <main className="px-6 py-8 lg:px-10">
        <p className="text-sm text-muted">
          {editing
            ? "Changes are visible to candidates as soon as you save."
            : "This is what candidates see next to your openings."}
        </p>

        {saved && !editing && (
          <p className="mt-6 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
            Profile saved
          </p>
        )}

        {error && !editing && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {!editing && company && (
          <>
            <section className="surface mt-6 rounded-xl p-8">
              <div className="flex flex-wrap items-start gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-panel-2 font-display text-lg font-bold text-brand-soft">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-2xl font-bold text-text">
                    {company.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
                    {company.location ? <span>{company.location}</span> : null}
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-brand underline underline-offset-4 transition hover:text-brand-soft">{cleanUrl}</a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="rule my-7" />

              {company.description ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                  {company.description}
                </p>
              ) : (
                <p className="text-sm text-muted/60">
                  No description yet. Candidates see this space next to every
                  role you publish, so it is worth filling in.
                </p>
              )}
            </section>

            <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">Total postings</p>
                <p className="mt-2 font-display text-2xl font-bold text-text">
                  {jobs.length}
                </p>
              </div>
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">Live right now</p>
                <p className="mt-2 font-display text-2xl font-bold text-text">
                  {liveJobs.length}
                </p>
              </div>
              <div className="bg-panel p-6">
                <p className="text-sm text-muted">Location</p>
                <p className="mt-2 font-display text-2xl font-bold text-text">
                  {company.location ?? "-"}
                </p>
              </div>
            </div>

            <section className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-brand">
                  Live openings
                </h2>
                <Link
                  href="/dashboard/jobs"
                  className="text-sm text-muted underline underline-offset-4 transition hover:text-text"
                >
                  Manage postings
                </Link>
              </div>

              {liveJobs.length === 0 ? (
                <div className="surface mt-4 rounded-xl px-6 py-12 text-center">
                  <p className="text-sm text-muted">
                    No live openings right now.
                  </p>
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {liveJobs.map((job) => (
                    <li
                      key={job.id}
                      className="surface flex flex-wrap items-center justify-between gap-3 rounded-lg px-5 py-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {job.title}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {job.location}
                        </p>
                      </div>
                      <span className="badge badge-neutral">
                        {JOB_TYPE_LABELS[job.type]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {editing && (
          <form onSubmit={handleSubmit} className="surface mt-6 rounded-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm text-muted">Company name</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={field}
                />
              </div>

              <div>
                <label className="text-sm text-muted">About the company</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={field}
                  placeholder="What your company does, who works there, what you are building."
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={field}
                    placeholder="Ramallah"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className={field}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary rounded-lg px-7 py-3 font-semibold disabled:opacity-50"
              >
                {saving ? "Saving" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-ghost rounded-lg px-7 py-3 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
