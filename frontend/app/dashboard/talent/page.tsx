"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  searchCandidates,
  type CandidateCard,
  type TalentSearchResult,
} from "@/lib/talent";
import InviteDialog from "@/components/invite-dialog";
import { useT } from "@/lib/i18n/context";
import { cityKey, type TranslationKey } from "@/lib/i18n/dictionaries";

function openSince(
  iso: string | null,
): { key: TranslationKey; count: number } | null {
  if (!iso) return null;
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return { key: "talent.openToday", count: 0 };
  if (days === 1) return { key: "talent.openYesterday", count: 1 };
  if (days < 30) return { key: "talent.openDays", count: days };
  const months = Math.floor(days / 30);
  return {
    key: months === 1 ? "talent.openMonth" : "talent.openMonths",
    count: months,
  };
}

export default function TalentSearchPage() {
  const t = useT();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [result, setResult] = useState<TalentSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviting, setInviting] = useState<CandidateCard | null>(null);
  const [invited, setInvited] = useState<Set<string>>(new Set());

  const [q, setQ] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [location, setLocation] = useState("");
  const [minYears, setMinYears] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "COMPANY") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  const run = useCallback(
    async (nextPage = 1) => {
      setError("");
      setLoading(true);
      try {
        const data = await searchCandidates({
          q: q || undefined,
          skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
          location: location || undefined,
          minYears: minYears ? Number(minYears) : undefined,
          page: nextPage,
        });
        setResult(data);
        setPage(nextPage);
      } catch {
        setError(t("talent.loadError"));
      } finally {
        setLoading(false);
      }
    },
    [q, skillsText, location, minYears],
  );

  useEffect(() => {
    if (!user || user.role !== "COMPANY") return;
    void run(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void run(1);
  }

  function clearFilters() {
    setQ("");
    setSkillsText("");
    setLocation("");
    setMinYears("");
    setTimeout(() => void run(1), 0);
  }

  const field =
    "mt-2 w-full rounded-lg border border-line bg-panel px-4 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none transition focus:border-brand";

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading</p>
      </div>
    );
  }

  const hasFilters = Boolean(q || skillsText || location || minYears);
  const totalPages = result ? Math.ceil(result.total / result.pageSize) : 1;

  return (
    <>
      <header className="border-b border-line px-6 py-5 lg:px-10">
        <p className="text-sm text-muted">{t("dash.companySpace")}</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-text">
          {t("nav.findTalent")}
        </h1>
      </header>

      <main className="px-6 py-8 lg:px-10">
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {t("talent.intro")}
        </p>

        <form onSubmit={handleSubmit} className="surface mt-6 rounded-xl p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs font-medium text-muted">{t("common.search")}</label>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={field}
                placeholder={t("talent.searchPlaceholder")}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">{t("talent.skills")}</label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className={field}
                placeholder="React, NestJS"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">{t("job.location")}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={field}
                placeholder={t("city.ramallah")}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted">
                {t("talent.minExperience")}
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={minYears}
                onChange={(e) => setMinYears(e.target.value)}
                className={field}
                placeholder={t("talent.years")}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? t("common.searching") : t("common.search")}
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-ghost rounded-lg px-5 py-2.5 text-sm"
              >
                {t("talent.clear")}
              </button>
            )}
            <p className="ml-auto text-xs text-muted">
              Matching any of the listed skills
            </p>
          </div>
        </form>

        {error && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {result && (
          <p className="mt-6 text-sm text-muted">
            {result.total === 0
              ? t("talent.noMatch")
              : t(
                  result.total === 1
                    ? "talent.countOne"
                    : "talent.countMany",
                  { count: result.total },
                )}
          </p>
        )}

        {result && result.items.length === 0 && !loading && (
          <div className="surface mt-4 rounded-xl px-8 py-16 text-center">
            <p className="font-semibold text-text">{t("talent.emptyTitle")}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              {hasFilters
                ? t("talent.emptyFiltered")
                : t("talent.emptyNone")}
            </p>
          </div>
        )}

        {result && result.items.length > 0 && (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {result.items.map((c) => (
              <CandidateTile
                key={c.id}
                candidate={c}
                invited={invited.has(c.id)}
                onInvite={() => setInviting(c)}
              />
            ))}
          </div>
        )}

        {result && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => void run(page - 1)}
              disabled={page <= 1 || loading}
              className="btn-ghost rounded-lg px-5 py-2 text-sm disabled:opacity-40"
            >
              {t("common.previous")}
            </button>
            <span className="text-sm text-muted">
              {page} of {totalPages}
            </span>
            <button
              onClick={() => void run(page + 1)}
              disabled={page >= totalPages || loading}
              className="btn-ghost rounded-lg px-5 py-2 text-sm disabled:opacity-40"
            >
              {t("common.next")}
            </button>
          </div>
        )}
      </main>

      {inviting && (
        <InviteDialog
          candidate={inviting}
          onClose={() => setInviting(null)}
          onSent={(id) => setInvited((prev) => new Set(prev).add(id))}
        />
      )}
    </>
  );
}

function CandidateTile({
  candidate,
  invited,
  onInvite,
}: {
  candidate: CandidateCard;
  invited: boolean;
  onInvite: () => void;
}) {
  const t = useT();
  const initials = candidate.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const links = [
    { label: "GitHub", url: candidate.githubUrl },
    { label: "LinkedIn", url: candidate.linkedinUrl },
    { label: "Portfolio", url: candidate.portfolioUrl },
  ].filter((l) => l.url);

  return (
    <article className="surface flex flex-col rounded-xl p-6 transition hover:border-brand/40">
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-sm font-bold text-brand ring-1 ring-brand/20">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text">
            {candidate.fullName}
          </h3>
          <p className="truncate text-sm text-muted">
            {candidate.headline ?? t("talent.noHeadline")}
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        {candidate.location && <span>{t(cityKey(candidate.location))}</span>}
        {candidate.yearsOfExperience != null && (
          <span>
            {t(
              candidate.yearsOfExperience === 1
                ? "talent.yearOne"
                : "talent.yearMany",
              { count: candidate.yearsOfExperience },
            )}
          </span>
        )}
      </div>

      {candidate.bio && (
        <p className="mt-3.5 line-clamp-3 text-xs leading-relaxed text-muted/80">
          {candidate.bio}
        </p>
      )}

      {candidate.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {candidate.skills.slice(0, 5).map((s) => (
            <span key={s} className="badge badge-neutral text-[11px]">
              {s}
            </span>
          ))}
          {candidate.skills.length > 5 && (
            <span className="text-[11px] text-muted/60">
              +{candidate.skills.length - 5}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1.5 text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(46,116,181,0.9)]" />
          {(() => {
            const since = openSince(candidate.openToWorkSince);
            return since ? t(since.key, { count: since.count }) : "";
          })()}
        </span>

        {links.length > 0 && (
          <span className="ms-auto flex gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.url!}
                target="_blank"
                rel="noreferrer"
                className="text-muted underline underline-offset-4 transition hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          </span>
        )}
      </div>

      <button
        onClick={onInvite}
        disabled={invited}
        className={
          invited
            ? "mt-5 w-full cursor-default rounded-lg border border-success/40 bg-success/10 py-2.5 text-sm font-medium text-success"
            : "btn-primary mt-5 w-full rounded-lg py-2.5 text-sm font-semibold"
        }
      >
        {invited ? t("talent.invited") : t("talent.invite")}
      </button>
    </article>
  );
}