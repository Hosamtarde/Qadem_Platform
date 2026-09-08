"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createJob, deleteJob, listMyJobs, updateJob } from "@/lib/jobs";
import { ApiRequestError } from "@/lib/api";
import { Job, JobType, JOB_TYPE_LABELS } from "@/lib/types";
import Logo from "@/components/logo";

const TYPES: JobType[] = ["FULL_TIME", "PART_TIME", "INTERNSHIP"];

export default function ManageJobsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  function openCreate() {
    resetForm();
    setEditingId(null);
    setError("");
    setFormOpen(true);
  }

  function openEdit(job: Job) {
    setTitle(job.title);
    setDescription(job.description);
    setRequirements(job.requirements ?? "");
    setType(job.type);
    setLocation(job.location);
    setSalaryMin(job.salaryMin ? String(job.salaryMin) : "");
    setSalaryMax(job.salaryMax ? String(job.salaryMax) : "");
    setEditingId(job.id);
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title,
      description,
      requirements: requirements || undefined,
      type,
      location,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
    };

    try {
      if (editingId) {
        const updated = await updateJob(editingId, payload);
        setJobs(jobs.map((j) => (j.id === editingId ? updated : j)));
      } else {
        const job = await createJob(payload);
        setJobs([job, ...jobs]);
      }
      closeForm();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.messages.join(", "));
      } else {
        setError("Could not save the role.");
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
    "mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-text placeholder:text-muted/50 outline-none transition focus:border-brand";

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading</p>
      </div>
    );
  }

  const liveCount = jobs.filter((j) => j.isActive).length;

  return (
    <div className="relative min-h-screen">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <Link href="/dashboard" className="btn-ghost rounded-lg px-4 py-2 text-sm">
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-text">
              My postings
            </h1>
            <p className="mt-2 text-sm text-muted">
              {jobs.length} total, {liveCount} live
            </p>
          </div>
          <button
            onClick={formOpen ? closeForm : openCreate}
            className={
              formOpen
                ? "btn-ghost rounded-lg px-6 py-2.5 text-sm font-semibold"
                : "btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold"
            }
          >
            {formOpen ? "Cancel" : "Publish a role"}
          </button>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {formOpen && (
          <form onSubmit={handleSubmit} className="surface mt-7 rounded-xl p-7">
            <h2 className="text-sm font-semibold text-brand">
              {editingId ? "Edit role" : "New role"}
            </h2>

            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                <div>
                  <label className="text-sm text-muted">Title</label>
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
                  <label className="text-sm text-muted">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={field}
                    placeholder="Ramallah"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted">Description</label>
                <textarea
                  required
                  minLength={20}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={field}
                  placeholder="What the person will work on day to day."
                />
              </div>

              <div>
                <label className="text-sm text-muted">Requirements</label>
                <textarea
                  rows={2}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className={field}
                  placeholder="Skills and experience you expect."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-[2fr_1fr_1fr]">
                <div>
                  <label className="text-sm text-muted">Type</label>
                  <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-line bg-panel p-1">
                    {TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={
                          type === t
                            ? "btn-primary rounded-md py-2 text-xs font-semibold"
                            : "rounded-md py-2 text-xs text-muted transition hover:text-text"
                        }
                      >
                        {JOB_TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted">Salary from</label>
                  <input
                    type="number"
                    min={0}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">Salary to</label>
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

            <div className="mt-7 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary rounded-lg px-7 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Saving" : editingId ? "Save changes" : "Publish role"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="btn-ghost rounded-lg px-7 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {jobs.length === 0 && !formOpen && (
          <div className="surface mt-8 rounded-xl px-8 py-16 text-center">
            <p className="font-semibold text-text">No roles published yet</p>
            <p className="mt-2 text-sm text-muted">
              Publish your first opening and it will appear on the public board.
            </p>
          </div>
        )}

        {jobs.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-xl border border-line">
            <div className="hidden border-b border-line bg-panel-2 px-5 py-3 text-xs font-medium text-muted sm:grid sm:grid-cols-[1fr_130px_110px_120px_180px]">
              <span>Role</span>
              <span>Type</span>
              <span>Status</span>
              <span>Salary</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="divide-y divide-line">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="grid gap-3 bg-panel px-5 py-4 transition hover:bg-panel-2 sm:grid-cols-[1fr_130px_110px_120px_180px] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">
                      {job.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{job.location}</p>
                  </div>

                  <span className="text-xs text-muted">
                    {JOB_TYPE_LABELS[job.type]}
                  </span>

                  <span
                    className={
                      job.isActive
                        ? "badge badge-success w-fit"
                        : "badge badge-neutral w-fit"
                    }
                  >
                    {job.isActive ? "Live" : "Paused"}
                  </span>

                  <span className="text-xs text-muted">
                    {job.salaryMin || job.salaryMax
                      ? `${job.salaryMin ?? "?"} - ${job.salaryMax ?? "?"}`
                      : "Not set"}
                  </span>

                  <div className="flex flex-wrap gap-1.5 sm:justify-end">
                    <button
                      onClick={() => openEdit(job)}
                      className="rounded-md border border-line px-3 py-1.5 text-xs text-muted transition hover:border-brand/50 hover:text-text"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggle(job)}
                      className="rounded-md border border-line px-3 py-1.5 text-xs text-muted transition hover:border-brand/50 hover:text-text"
                    >
                      {job.isActive ? "Pause" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      className="rounded-md border border-danger/30 px-3 py-1.5 text-xs text-danger/80 transition hover:bg-danger/10 hover:text-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
