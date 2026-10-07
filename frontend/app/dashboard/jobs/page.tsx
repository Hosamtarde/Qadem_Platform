"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createJob, deleteJob, listMyJobs, updateJob } from "@/lib/jobs";
import { ApiRequestError } from "@/lib/api";
import { Job, JobType } from "@/lib/types";
import { useT } from "@/lib/i18n/context";
import { cityKey, jobTypeKey } from "@/lib/i18n/dictionaries";

const TYPES: JobType[] = ["FULL_TIME", "PART_TIME", "INTERNSHIP"];

export default function ManageJobsPage() {
  const t = useT();
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
      .catch(() => setError(t("post.loadError")))
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
        setError(t("post.saveError"));
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
      setError(t("post.updateError"));
    }
  }

  async function handleDelete(job: Job) {
    if (!confirm(t("post.confirmDelete", { title: job.title }))) return;
    try {
      await deleteJob(job.id);
      setJobs(jobs.filter((j) => j.id !== job.id));
    } catch {
      setError(t("post.deleteError"));
    }
  }

  const field =
    "mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-text placeholder:text-muted/50 outline-none transition focus:border-brand";

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">{t("common.loading")}</p>
      </div>
    );
  }

  const liveCount = jobs.filter((j) => j.isActive).length;

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 lg:px-10">
        <div>
          <p className="text-sm text-muted">{t("dash.companySpace")}</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-text">
            {t("nav.myPostings")}
          </h1>
        </div>
        <button
          onClick={formOpen ? closeForm : openCreate}
          className={
            formOpen
              ? "btn-ghost rounded-lg px-6 py-2.5 text-sm font-semibold"
              : "btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold"
          }
        >
          {formOpen ? t("common.cancel") : t("post.publishRole")}
        </button>
      </header>

      <main className="px-6 py-8 lg:px-10">
        <p className="text-sm text-muted">
          {t("post.summary", { total: jobs.length, live: liveCount })}
        </p>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {formOpen && (
          <form onSubmit={handleSubmit} className="surface mt-6 rounded-xl p-7">
            <h2 className="text-sm font-semibold text-brand">
              {editingId ? t("post.editRole") : t("post.newRole")}
            </h2>

            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                <div>
                  <label className="text-sm text-muted">{t("post.titleLabel")}</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={field}
                    placeholder={t("post.titlePlaceholder")}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">{t("job.location")}</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={field}
                    placeholder={t("city.ramallah")}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted">{t("post.description")}</label>
                <textarea
                  required
                  minLength={20}
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={field}
                  placeholder={t("post.descriptionPlaceholder")}
                />
              </div>

              <div>
                <label className="text-sm text-muted">{t("job.requirements")}</label>
                <textarea
                  rows={2}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className={field}
                  placeholder={t("post.requirementsPlaceholder")}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-[2fr_1fr_1fr]">
                <div>
                  <label className="text-sm text-muted">{t("job.type")}</label>
                  <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-line bg-panel p-1">
                    {TYPES.map((jt) => (
                      <button
                        key={jt}
                        type="button"
                        onClick={() => setType(jt)}
                        className={
                          type === jt
                            ? "btn-primary rounded-md py-2 text-xs font-semibold"
                            : "rounded-md py-2 text-xs text-muted transition hover:text-text"
                        }
                      >
                        {t(jobTypeKey(jt))}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted">{t("post.salaryFrom")}</label>
                  <input
                    type="number"
                    min={0}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">{t("post.salaryTo")}</label>
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
                {saving ? t("common.saving") : editingId ? t("common.saveChanges") : t("post.publish")}
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
          <div className="surface mt-6 rounded-xl px-8 py-16 text-center">
            <p className="font-semibold text-text">{t("post.emptyTitle")}</p>
            <p className="mt-2 text-sm text-muted">{t("post.emptyBody")}</p>
          </div>
        )}

        {jobs.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-xl border border-line">
            <div className="hidden border-b border-line bg-panel-2 px-5 py-3 text-xs font-medium text-muted sm:grid sm:grid-cols-[1fr_130px_110px_120px_180px]">
              <span>{t("invite.role")}</span>
              <span>{t("job.type")}</span>
              <span>{t("post.status")}</span>
              <span>{t("job.salary")}</span>
              <span className="text-end">{t("post.actions")}</span>
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
                    <p className="mt-0.5 text-xs text-muted">
                      {t(cityKey(job.location))}
                    </p>
                  </div>

                  <span className="text-xs text-muted">
                    {t(jobTypeKey(job.type))}
                  </span>

                  <span
                    className={
                      job.isActive
                        ? "badge badge-success w-fit"
                        : "badge badge-neutral w-fit"
                    }
                  >
                    {job.isActive ? t("post.live") : t("post.paused")}
                  </span>

                  <span className="text-xs text-muted">
                    {job.salaryMin || job.salaryMax
                      ? `${job.salaryMin ?? "?"} - ${job.salaryMax ?? "?"}`
                      : t("post.notSet")}
                  </span>

                  <div className="flex flex-wrap gap-1.5 sm:justify-end">
                    <button
                      onClick={() => openEdit(job)}
                      className="rounded-md border border-line px-3 py-1.5 text-xs text-muted transition hover:border-brand/50 hover:text-text"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => handleToggle(job)}
                      className="rounded-md border border-line px-3 py-1.5 text-xs text-muted transition hover:border-brand/50 hover:text-text"
                    >
                      {job.isActive ? t("post.pause") : t("post.publishShort")}
                    </button>
                    <button
                      onClick={() => handleDelete(job)}
                      className="rounded-md border border-danger/30 px-3 py-1.5 text-xs text-danger/80 transition hover:bg-danger/10 hover:text-danger"
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
