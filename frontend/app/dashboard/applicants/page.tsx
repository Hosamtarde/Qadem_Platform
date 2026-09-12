"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { listMyJobs } from "@/lib/jobs";
import { listJobApplications, updateApplicationStatus } from "@/lib/applications";
import { downloadResume } from "@/lib/candidates";
import { ApiRequestError } from "@/lib/api";
import {
  Application,
  ApplicationStatus,
  Job,
  JOB_TYPE_LABELS,
  STATUS_BADGES,
  STATUS_LABELS,
} from "@/lib/types";

const NEXT_STATES: Record<ApplicationStatus, ApplicationStatus[]> = {
  SUBMITTED: ["REVIEWING", "ACCEPTED", "REJECTED"],
  REVIEWING: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

const linkClass =
  "text-brand underline underline-offset-4 transition hover:text-brand-soft";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ApplicantsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "COMPANY") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "COMPANY") return;
    listMyJobs()
      .then((data) => {
        setJobs(data);
        if (data.length) setSelectedJobId(data[0].id);
      })
      .catch(() => setError("Could not load your postings."))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!selectedJobId) return;
    setLoadingApps(true);
    setError("");
    listJobApplications(selectedJobId)
      .then(setApplications)
      .catch(() => setError("Could not load applicants for this role."))
      .finally(() => setLoadingApps(false));
  }, [selectedJobId]);

  const counts = useMemo(() => {
    const base: Record<string, number> = {
      SUBMITTED: 0,
      REVIEWING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    };
    applications.forEach((a) => {
      base[a.status] += 1;
    });
    return base;
  }, [applications]);

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? applications
        : applications.filter((a) => a.status === filter),
    [applications, filter],
  );

  async function changeStatus(app: Application, status: ApplicationStatus) {
    setBusyId(app.id);
    setError("");
    try {
      const updated = await updateApplicationStatus(
        app.id,
        status,
        noteDraft.trim() || undefined,
      );
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? updated : a)),
      );
      setNoteDraft("");
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.messages.join(", ")
          : "Could not update this application.",
      );
    } finally {
      setBusyId(null);
    }
  }

  function toggle(app: Application) {
    if (openId === app.id) {
      setOpenId(null);
      return;
    }
    setOpenId(app.id);
    setNoteDraft(app.companyNote ?? "");
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading</p>
      </div>
    );
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;

  return (
    <>
      <header className="border-b border-line px-6 py-5 lg:px-10">
        <p className="text-sm text-muted">Company workspace</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-text">
          Applicants
        </h1>
      </header>

      <main className="px-6 py-8 lg:px-10">
        <p className="text-sm text-muted">
          Review who applied and move them through your pipeline.
        </p>

        {jobs.length === 0 && (
          <div className="surface mt-6 rounded-xl px-8 py-16 text-center">
            <p className="font-semibold text-text">No postings yet</p>
            <p className="mt-2 text-sm text-muted">
              Publish a role and applicants will show up here.
            </p>
            <Link
              href="/dashboard/jobs"
              className="btn-primary mt-7 inline-block rounded-lg px-6 py-2.5 text-sm font-semibold"
            >
              Publish a role
            </Link>
          </div>
        )}

        {jobs.length > 0 && (
          <>
            <div className="mt-6">
              <label className="text-sm text-muted">Posting</label>
              <select
                value={selectedJobId ?? ""}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  setOpenId(null);
                  setFilter("ALL");
                }}
                className="mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-text outline-none transition focus:border-brand sm:max-w-md"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {JOB_TYPE_LABELS[job.type]} - {job.location}
                  </option>
                ))}
              </select>
              {selectedJob && !selectedJob.isActive && (
                <p className="mt-2 text-xs text-warn">
                  This posting is paused. It no longer accepts new applications.
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
              {(
                ["SUBMITTED", "REVIEWING", "ACCEPTED", "REJECTED"] as ApplicationStatus[]
              ).map((s) => (
                <div key={s} className="bg-panel p-5">
                  <span className={`badge ${STATUS_BADGES[s]}`}>
                    {STATUS_LABELS[s]}
                  </span>
                  <p className="mt-3 font-display text-2xl font-bold text-text">
                    {counts[s]}
                  </p>
                </div>
              ))}
            </div>

            {error && (
              <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            )}

            <div className="mt-6 inline-flex flex-wrap gap-1 rounded-lg border border-line bg-panel p-1">
              {(
                ["ALL", "SUBMITTED", "REVIEWING", "ACCEPTED", "REJECTED"] as (
                  | ApplicationStatus
                  | "ALL"
                )[]
              ).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? "btn-primary rounded-md px-4 py-2 text-xs font-semibold"
                      : "rounded-md px-4 py-2 text-xs text-muted transition hover:text-text"
                  }
                >
                  {f === "ALL" ? "All" : STATUS_LABELS[f]}
                </button>
              ))}
            </div>

            {loadingApps && (
              <p className="mt-6 text-sm text-muted">Loading applicants</p>
            )}

            {!loadingApps && applications.length === 0 && (
              <div className="surface mt-6 rounded-xl px-8 py-16 text-center">
                <p className="font-semibold text-text">No applicants yet</p>
                <p className="mt-2 text-sm text-muted">
                  Nobody has applied to this role so far.
                </p>
              </div>
            )}

            {!loadingApps && applications.length > 0 && visible.length === 0 && (
              <div className="surface mt-6 rounded-xl px-8 py-14 text-center">
                <p className="text-sm text-muted">
                  No applicants with this status.
                </p>
              </div>
            )}

            <ul className="mt-6 space-y-3">
              {visible.map((app) => {
                const c = app.candidate;
                const isOpen = openId === app.id;
                const initials = c
                  ? c.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")
                  : "?";
                const nextStates = NEXT_STATES[app.status];

                return (
                  <li key={app.id} className="surface rounded-xl">
                    <button
                      onClick={() => toggle(app)}
                      className="flex w-full flex-wrap items-center justify-between gap-4 p-6 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-panel-2 text-xs font-semibold text-brand-soft">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-text">
                            {c?.fullName ?? "Candidate"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {c?.headline ?? c?.email}
                            {c?.location ? ` - ${c.location}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="hidden text-xs text-muted sm:inline">
                          {formatDate(app.createdAt)}
                        </span>
                        <span className={`badge ${STATUS_BADGES[app.status]}`}>
                          {STATUS_LABELS[app.status]}
                        </span>
                      </div>
                    </button>

                    {isOpen && c && (
                      <div className="border-t border-line px-6 py-6">
                        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                          <div>
                            <h3 className="text-sm font-semibold text-brand">
                              Cover letter
                            </h3>
                            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                              {app.coverLetter ?? "No note was included."}
                            </p>

                            {c.skills.length > 0 && (
                              <>
                                <h3 className="mt-7 text-sm font-semibold text-brand">
                                  Skills
                                </h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {c.skills.map((s) => (
                                    <span key={s} className="badge badge-neutral">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="space-y-5">
                            <div className="rounded-lg border border-line bg-panel-2 p-5">
                              <h3 className="text-sm font-semibold text-text">
                                Contact
                              </h3>
                              <dl className="mt-3 space-y-2 text-sm">
                                <div>
                                  <dt className="text-xs text-muted">Email</dt>
                                  <dd className="break-all text-text">
                                    {c.email}
                                  </dd>
                                </div>
                                {c.phone && (
                                  <div>
                                    <dt className="text-xs text-muted">Phone</dt>
                                    <dd className="text-text">{c.phone}</dd>
                                  </div>
                                )}
                                {c.yearsOfExperience != null && (
                                  <div>
                                    <dt className="text-xs text-muted">
                                      Experience
                                    </dt>
                                    <dd className="text-text">
                                      {c.yearsOfExperience} years
                                    </dd>
                                  </div>
                                )}
                              </dl>

                              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                {c.linkedinUrl ? (
                                  <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className={linkClass}>LinkedIn</a>
                                ) : null}
                                {c.githubUrl ? (
                                  <a href={c.githubUrl} target="_blank" rel="noreferrer" className={linkClass}>GitHub</a>
                                ) : null}
                                {c.portfolioUrl ? (
                                  <a href={c.portfolioUrl} target="_blank" rel="noreferrer" className={linkClass}>Portfolio</a>
                                ) : null}
                              </div>
                            </div>

                            <div className="rounded-lg border border-line bg-panel-2 p-5">
                              <h3 className="text-sm font-semibold text-text">
                                Resume
                              </h3>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {c.hasResumeFile && c.profileId ? (
                                  <button
                                    onClick={() =>
                                      downloadResume(
                                        c.profileId as string,
                                        `${c.fullName}-resume`,
                                      )
                                    }
                                    className="btn-ghost rounded-lg px-4 py-2 text-xs"
                                  >
                                    Download file
                                  </button>
                                ) : null}
                                {c.resumeUrl ? (
                                  <a href={c.resumeUrl} target="_blank" rel="noreferrer" className="btn-ghost rounded-lg px-4 py-2 text-xs">Open link</a>
                                ) : null}
                                {!c.hasResumeFile && !c.resumeUrl ? (
                                  <p className="text-sm text-muted/60">
                                    No resume provided
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rule my-6" />

                        <h3 className="text-sm font-semibold text-brand">
                          Your note
                        </h3>
                        <textarea
                          rows={2}
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Visible to the candidate."
                          className="mt-3 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none transition focus:border-brand"
                        />

                        {nextStates.length > 0 ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {nextStates.map((s) => (
                              <button
                                key={s}
                                disabled={busyId === app.id}
                                onClick={() => changeStatus(app, s)}
                                className={
                                  s === "REJECTED"
                                    ? "rounded-lg border border-danger/40 px-5 py-2.5 text-sm text-danger transition hover:bg-danger/10 disabled:opacity-50"
                                    : s === "ACCEPTED"
                                      ? "rounded-lg border border-success/40 px-5 py-2.5 text-sm text-success transition hover:bg-success/10 disabled:opacity-50"
                                      : "btn-ghost rounded-lg px-5 py-2.5 text-sm disabled:opacity-50"
                                }
                              >
                                {busyId === app.id
                                  ? "Saving"
                                  : `Mark ${STATUS_LABELS[s].toLowerCase()}`}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-muted">
                            This application is closed. Its status cannot change
                            again.
                          </p>
                        )}

                        {app.respondedAt && (
                          <p className="mt-4 text-xs text-muted/60">
                            First response {formatDate(app.respondedAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
