"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  listMyInvitations,
  respondToInvitation,
  type Invitation,
} from "@/lib/invitations";
import { ApiRequestError } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "badge badge-neutral",
  ACCEPTED: "badge badge-success",
  DECLINED: "badge badge-neutral",
  EXPIRED: "badge badge-neutral",
};

function daysLeft(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function MyInvitationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [working, setWorking] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "CANDIDATE") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "CANDIDATE") return;
    listMyInvitations()
      .then(setInvitations)
      .catch(() => setError("Could not load your invitations."))
      .finally(() => setLoading(false));
  }, [user]);

  async function respond(
    id: string,
    status: "ACCEPTED" | "DECLINED",
    declineReason?: string,
  ) {
    setError("");
    setWorking(id);
    try {
      const updated = await respondToInvitation(id, status, declineReason);
      setInvitations((list) =>
        list.map((i) => (i.id === id ? updated : i)),
      );
      setDecliningId(null);
      setReason("");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.messages.join(", "));
      } else {
        setError("Could not send your answer.");
      }
    } finally {
      setWorking(null);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading</p>
      </div>
    );
  }

  const pending = invitations.filter((i) => i.status === "PENDING");
  const past = invitations.filter((i) => i.status !== "PENDING");

  return (
    <>
      <header className="border-b border-line px-6 py-5 lg:px-10">
        <p className="text-sm text-muted">Candidate workspace</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-text">
          Invitations
        </h1>
      </header>

      <main className="px-6 py-8 lg:px-10">
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Companies that found your profile and want you to apply. Accepting
          puts you straight into their pipeline and shares your contact details
          with them.
        </p>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {invitations.length === 0 && (
          <div className="surface mt-6 rounded-xl px-8 py-16 text-center">
            <p className="font-semibold text-text">No invitations yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Turn on Open to work in your profile so companies searching for
              talent can find you.
            </p>
          </div>
        )}

        {pending.length > 0 && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-brand">
              Waiting for your answer
            </h2>

            <div className="mt-4 space-y-4">
              {pending.map((inv) => {
                const left = daysLeft(inv.expiresAt);
                return (
                  <article
                    key={inv.id}
                    className="rounded-xl border border-brand/35 bg-brand/[0.06] p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-bold text-text">
                          {inv.job?.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                          {inv.company?.name}
                          {inv.job?.location ? ` · ${inv.job.location}` : ""}
                        </p>
                      </div>

                      <span
                        className={
                          left <= 3
                            ? "text-xs font-medium text-danger"
                            : "text-xs text-muted"
                        }
                      >
                        {left <= 0
                          ? "Expires today"
                          : `${left} ${left === 1 ? "day" : "days"} left`}
                      </span>
                    </div>

                    {(inv.job?.salaryMin || inv.job?.salaryMax) && (
                      <p className="mt-2 text-sm text-muted">
                        {inv.job.salaryMin ?? "?"} – {inv.job.salaryMax ?? "?"}
                      </p>
                    )}

                    {inv.message && (
                      <blockquote className="mt-4 border-l-2 border-brand/40 pl-4 text-sm leading-relaxed text-muted">
                        {inv.message}
                      </blockquote>
                    )}

                    {decliningId === inv.id ? (
                      <div className="mt-5">
                        <label className="text-xs font-medium text-muted">
                          Reason (optional, shared with the company)
                        </label>
                        <input
                          type="text"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          maxLength={300}
                          className="mt-2 w-full rounded-lg border border-line bg-panel px-4 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none transition focus:border-brand"
                          placeholder="Not the right fit right now"
                        />
                        <div className="mt-3 flex gap-2.5">
                          <button
                            onClick={() =>
                              void respond(inv.id, "DECLINED", reason || undefined)
                            }
                            disabled={working === inv.id}
                            className="rounded-lg border border-danger/40 px-5 py-2 text-sm text-danger transition hover:bg-danger/10 disabled:opacity-50"
                          >
                            {working === inv.id ? "Sending" : "Confirm decline"}
                          </button>
                          <button
                            onClick={() => {
                              setDecliningId(null);
                              setReason("");
                            }}
                            className="btn-ghost rounded-lg px-5 py-2 text-sm"
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 flex flex-wrap gap-2.5">
                        <button
                          onClick={() => void respond(inv.id, "ACCEPTED")}
                          disabled={working === inv.id}
                          className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
                        >
                          {working === inv.id ? "Accepting" : "Accept"}
                        </button>
                        <button
                          onClick={() => setDecliningId(inv.id)}
                          className="btn-ghost rounded-lg px-6 py-2.5 text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold text-muted">Past</h2>

            <div className="mt-4 overflow-hidden rounded-xl border border-line">
              <ul className="divide-y divide-line">
                {past.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex flex-wrap items-center gap-3 bg-panel px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">
                        {inv.job?.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {inv.company?.name}
                        {inv.declineReason ? ` · ${inv.declineReason}` : ""}
                      </p>
                    </div>
                    <span className={STATUS_STYLES[inv.status]}>
                      {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  );
}