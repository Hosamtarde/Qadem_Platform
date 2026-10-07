"use client";

import { useT } from "@/lib/i18n/context";

import { useEffect, useState } from "react";
import { listMyJobs } from "@/lib/jobs";
import { inviteCandidate } from "@/lib/invitations";
import { ApiRequestError } from "@/lib/api";
import type { Job } from "@/lib/types";
import type { CandidateCard } from "@/lib/talent";

export default function InviteDialog({
  candidate,
  onClose,
  onSent,
}: {
  candidate: CandidateCard;
  onClose: () => void;
  onSent: (candidateId: string) => void;
}) {
  const t = useT();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listMyJobs()
      .then((all) => {
        const live = all.filter((j) => j.isActive);
        setJobs(live);
        if (live.length > 0) setJobId(live[0].id);
      })
      .catch(() => setError(t("invite.loadError")))
      .finally(() => setLoading(false));
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await inviteCandidate({
        jobId,
        candidateProfileId: candidate.id,
        message: message || undefined,
      });
      onSent(candidate.id);
      onClose();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.messages.join(", "));
      } else {
        setError(t("invite.sendError"));
      }
    } finally {
      setSending(false);
    }
  }

  const field =
    "mt-2 w-full rounded-lg border border-line bg-panel px-4 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none transition focus:border-brand";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="surface relative z-10 w-full max-w-lg rounded-2xl p-7">
        <h2 className="font-display text-xl font-bold text-text">
          {t("invite.title", { name: candidate.fullName })}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {t("invite.body")}
        </p>

        {loading && (
          <p className="mt-6 text-sm text-muted">{t("invite.loadingRoles")}</p>
        )}

        {!loading && jobs.length === 0 && (
          <div className="mt-6 rounded-lg border border-line bg-panel-2 px-4 py-5 text-center">
            <p className="text-sm font-medium text-text">
              {t("invite.noPostings")}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t("invite.noPostingsBody")}
            </p>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <form onSubmit={handleSend} className="mt-6">
            <label className="text-xs font-medium text-muted">{t("invite.role")}</label>
            <select
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className={field}
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.location}
                </option>
              ))}
            </select>

            <label className="mt-5 block text-xs font-medium text-muted">
              {t("invite.message")}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={field}
              placeholder={t("invite.messagePlaceholder")}
            />

            {error && (
              <p className="mt-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={sending || !jobId}
                className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                {sending ? t("invite.sending") : t("invite.send")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost rounded-lg px-6 py-2.5 text-sm"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        )}

        {!loading && jobs.length === 0 && (
          <button
            onClick={onClose}
            className="btn-ghost mt-5 w-full rounded-lg py-2.5 text-sm"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}