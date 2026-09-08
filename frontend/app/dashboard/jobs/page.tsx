"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createJob, deleteJob, listMyJobs, updateJob } from "@/lib/jobs";
import { ApiRequestError } from "@/lib/api";
import { Job, JobType, JOB_TYPE_LABELS } from "@/lib/types";

const TYPES: JobType[] = ["FULL_TIME", "PART_TIME", "INTERNSHIP"];

export default function ManageJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [type, setType] = useState<JobType>("FULL_TIME");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "COMPANY") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "COMPANY") return;
    listMyJobs()
      .then(setJobs)
      .catch(() => setError("Could not load your postings."))
      .finally(() => setLoading(false));
  }, [user]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setRequirements("");
    setType("FULL_TIME");
    setLocation("");
    setSalaryMin("");
    setSalaryMax("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const job = await createJob({
        title,
        description,
        requirements: requirements || undefined,
        type,
        location,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
      });
      setJobs([job, ...jobs]);
      resetForm();
      setFormOpen(false);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.messages.join(", "));
      } else {
        setError("Could not publish the role.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(job: Job) {
    try {
      const updated = await updateJob(job.id, { isActive: !job.isActive });
      setJobs(jobs.map((j) => (j.id === job.id ? updated : j)));
    } catch {
      setError("Could not update the posting.");
    }
  }

  async function handleDelete(job: Job) {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    try {
      await deleteJob(job.id);
      setJobs(jobs.filter((j) => j.id !== job.id));
    } catch {
      setError("Could not delete the posting.");
    }
  }

  const field =
    "mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-chalk placeholder:text-fog/40 outline-none transition focus:border-magenta/60";

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-fog">Loading</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aura" />

      <header className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link href="/dashboard" className="font-display text-2xl font-bold text-chalk">
          Job<span className="text-cyan">.</span>Platform
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-line px-4 py-2 text-sm text-fog transition hover:border-cyan/50 hover:text-chalk"
        >
          Back
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs tracking-[0.25em] text-magenta">
                YOUR OPENINGS
              </p>
              <h1 className="mt-4 font-display text-5xl font-bold text-chalk">
                My postings
              </h1>
              <p className="mt-4 text-fog">
                {jobs.length} {jobs.length === 1 ? "role" : "roles"} published
              </p>
            </div>
            <button
              onClick={() => setFormOpen(!formOpen)}
              className="btn-glow btn-glow-magenta rounded-xl bg-magenta px-6 py-3 font-bold text-void"
            >
              {formOpen ? "Cancel" : "Publish a role"}
            </button>
          </div>

        {error && (
          <p className="mt-6 rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3 text-sm text-magenta">
            {error}
          </p>
        )}

        {formOpen && (
          <form onSubmit={handleCreate} className="card mt-8 rounded-2xl p-8">
            <h2 className="font-display text-sm font-bold tracking-wider text-cyan">
              NEW ROLE
            </h2>

            <div className="mt-7 space-y-6">
              <div>
                <label className="text-sm text-fog">Title</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={field}
                  placeholder="Backend Engineer"
                />
              </div>

              <div>
                <label className="text-sm text-fog">Description</label>
                <textarea
                  required
                  minLength={20}
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={field}
                  placeholder="What the person will work on day to day."
                />
              </div>

              <div>
                <label className="text-sm text-fog">Requirements</label>
                <textarea
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className={field}
                  placeholder="Skills and experience you expect."
                />
              </div>

              <div>
                <label className="text-sm text-fog">Type</label>
                <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-surface p-1.5">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={
                        type === t
                          ? "rounded-lg bg-cyan py-3 text-sm font-bold text-void"
                          : "rounded-lg py-3 text-sm text-fog transition hover:text-chalk"
                      }
                    >
                      {JOB_TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <label className="text-sm text-fog">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={field}
                    placeholder="Ramallah"
                  />
                </div>
                <div>
                  <label className="text-sm text-fog">Salary from</label>
                  <input
                    type="number"
                    min={0}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className="text-sm text-fog">Salary to</label>
                  <input
                    type="number"
                    min={0}
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    className={field}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-glow mt-8 rounded-xl bg-cyan px-7 py-3.5 font-bold text-void disabled:opacity-50"
            >
              {saving ? "Publishing" : "Publish role"}
            </button>
          </form>
        )}

        {jobs.length === 0 && !formOpen && (
          <div className="card mt-10 rounded-2xl px-8 py-20 text-center">
            <p className="font-display font-bold text-chalk">
              No roles published yet
            </p>
            <p className="mt-2 text-sm text-fog">
              Publish your first opening and it will appear on the public board.
            </p>
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {jobs.map((job, i) => (
              <li className="card rounded-2xl p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-xl font-bold text-chalk">
                        {job.title}
                      </h2>
                      <span
                        className={
                          job.isActive
                            ? "rounded-md border border-cyan/40 px-2.5 py-0.5 text-xs font-medium text-cyan"
                            : "rounded-md border border-line px-2.5 py-0.5 text-xs text-fog/60"
                        }
                      >
                        {job.isActive ? "Live" : "Paused"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-fog">
                      {JOB_TYPE_LABELS[job.type]} - {job.location}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(job)}
                      className="rounded-lg border border-line px-4 py-2 text-sm text-fog transition hover:border-cyan/50 hover:text-chalk"
                    >
                      {job.isActive ? "Pause" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      className="rounded-lg border border-magenta/40 px-4 py-2 text-sm text-magenta transition hover:bg-magenta/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-5 line-clamp-2 text-sm leading-relaxed text-fog">
                  {job.description}
                </p>
              </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
