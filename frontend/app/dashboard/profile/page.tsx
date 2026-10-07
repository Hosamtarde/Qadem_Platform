"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  downloadResume,
  getMyProfile,
  removeResume,
  updateMyProfile,
  uploadResume,
} from "@/lib/candidates";
import { ApiRequestError } from "@/lib/api";
import { CandidateProfile } from "@/lib/types";
import { useT } from "@/lib/i18n/context";
import { cityKey } from "@/lib/i18n/dictionaries";

const linkClass =
  "text-brand underline underline-offset-4 transition hover:text-brand-soft";

export default function CandidateProfilePage() {
  const t = useT();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [togglingOpen, setTogglingOpen] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [years, setYears] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "CANDIDATE") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || user.role !== "CANDIDATE") return;
    getMyProfile()
      .then(setProfile)
      .catch(() => setError(t("prof.loadError")))
      .finally(() => setLoading(false));
  }, [user]);

  function startEditing() {
    if (!profile) return;
    setHeadline(profile.headline ?? "");
    setBio(profile.bio ?? "");
    setPhone(profile.phone ?? "");
    setLocation(profile.location ?? "");
    setSkillsText(profile.skills.join(", "));
    setYears(
      profile.yearsOfExperience != null ? String(profile.yearsOfExperience) : "",
    );
    setLinkedinUrl(profile.linkedinUrl ?? "");
    setGithubUrl(profile.githubUrl ?? "");
    setPortfolioUrl(profile.portfolioUrl ?? "");
    setResumeUrl(profile.resumeUrl ?? "");
    setError("");
    setSaved(false);
    setEditing(true);
  }

  async function toggleOpenToWork() {
    if (!profile) return;
    setError("");
    setTogglingOpen(true);
    try {
      const updated = await updateMyProfile({
        isOpenToWork: !profile.isOpenToWork,
      });
      setProfile(updated);
    } catch {
      setError(t("prof.availabilityError"));
    } finally {
      setTogglingOpen(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const updated = await updateMyProfile({
        headline: headline || undefined,
        bio: bio || undefined,
        phone: phone || undefined,
        location: location || undefined,
        skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
        yearsOfExperience: years ? Number(years) : undefined,
        linkedinUrl: linkedinUrl || undefined,
        githubUrl: githubUrl || undefined,
        portfolioUrl: portfolioUrl || undefined,
        resumeUrl: resumeUrl || undefined,
      });
      setProfile(updated);
      setEditing(false);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.messages.join(", "));
      } else {
        setError(t("company.saveError"));
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const updated = await uploadResume(file);
      setProfile(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("prof.uploadFailed"));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleRemoveFile() {
    if (!confirm(t("prof.confirmRemove"))) return;
    setError("");
    try {
      const updated = await removeResume();
      setProfile(updated);
    } catch {
      setError(t("prof.removeError"));
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

  const initials = profile
    ? profile.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")
    : "";

  const hasLinks = Boolean(
    profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl,
  );

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 lg:px-10">
        <div>
          <p className="text-sm text-muted">{t("dash.candidateSpace")}</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-text">
            {t("prof.title")}
          </h1>
        </div>
        {!editing && (
          <button
            onClick={startEditing}
            className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold"
          >
            {t("dash.editProfile")}
          </button>
        )}
      </header>

      <main className="px-6 py-8 lg:px-10">
        <p className="text-sm text-muted">
          {editing
            ? t("prof.editingNote")
            : t("prof.viewNote")}
        </p>

        {saved && !editing && (
          <p className="mt-6 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
            Profile saved
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        {profile && (
          <section
            className={
              profile.isOpenToWork
                ? "mt-6 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-brand/40 bg-brand/[0.07] p-6"
                : "surface mt-6 flex flex-wrap items-center justify-between gap-5 rounded-xl p-6"
            }
          >
            <div className="flex items-start gap-4">
              <span
                className={
                  profile.isOpenToWork
                    ? "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/20 text-brand ring-1 ring-brand/30"
                    : "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-panel-2 text-muted"
                }
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-base font-semibold text-text">
                    {t("prof.openToWork")}
                  </h2>
                  {profile.isOpenToWork && (
                    <span className="flex items-center gap-1.5 rounded-full bg-brand/15 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(46,116,181,0.9)]" />
                      {t("prof.visible")}
                    </span>
                  )}
                </div>

                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                  {profile.isOpenToWork
                    ? t("prof.openOnBody")
                    : t("prof.openOffBody")}
                </p>
              </div>
            </div>

            <button
              onClick={toggleOpenToWork}
              disabled={togglingOpen}
              role="switch"
              aria-checked={profile.isOpenToWork}
              className={
                profile.isOpenToWork
                  ? "relative h-7 w-12 shrink-0 rounded-full bg-brand transition disabled:opacity-50"
                  : "relative h-7 w-12 shrink-0 rounded-full bg-line transition disabled:opacity-50"
              }
            >
              <span
                className={
                  profile.isOpenToWork
                    ? "absolute left-6 top-1 h-5 w-5 rounded-full bg-white shadow transition-all"
                    : "absolute left-1 top-1 h-5 w-5 rounded-full bg-muted/60 shadow transition-all"
                }
              />
            </button>
          </section>
        )}

        {!editing && profile && (
          <>
            <section className="surface mt-4 rounded-xl p-8">
              <div className="flex flex-wrap items-start gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-panel-2 font-display text-lg font-bold text-brand-soft">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-2xl font-bold text-text">
                    {profile.fullName}
                  </h2>
                  <p className="mt-1 text-muted">
                    {profile.headline ?? t("prof.noHeadline")}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
                    {profile.location ? (
                      <span>{t(cityKey(profile.location))}</span>
                    ) : null}
                    {profile.yearsOfExperience != null ? (
                      <span>
                        {profile.yearsOfExperience}
                        {profile.yearsOfExperience === 1 ? " year" : " years"} of
                        experience
                      </span>
                    ) : null}
                    <span>{profile.email}</span>
                    {profile.phone ? <span>{profile.phone}</span> : null}
                  </div>
                </div>
              </div>

              {profile.bio ? (
                <>
                  <div className="rule my-7" />
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                    {profile.bio}
                  </p>
                </>
              ) : null}

              {profile.skills.length > 0 ? (
                <>
                  <div className="rule my-7" />
                  <p className="text-sm font-semibold text-brand">
                    {t("talent.skills")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <span key={s} className="badge badge-neutral">
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}

              {hasLinks ? (
                <>
                  <div className="rule my-7" />
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    {profile.linkedinUrl ? (
                      <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className={linkClass}>LinkedIn</a>
                    ) : null}
                    {profile.githubUrl ? (
                      <a href={profile.githubUrl} target="_blank" rel="noreferrer" className={linkClass}>GitHub</a>
                    ) : null}
                    {profile.portfolioUrl ? (
                      <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className={linkClass}>Portfolio</a>
                    ) : null}
                  </div>
                </>
              ) : null}
            </section>

            <section className="surface mt-4 rounded-xl p-8">
              <h2 className="text-sm font-semibold text-brand">
                {t("appl.resume")}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {t("prof.resumeNote")}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-panel-2 p-5">
                  <p className="text-sm font-medium text-text">{t("prof.uploadedFile")}</p>
                  {profile.hasResumeFile ? (
                    <>
                      <p className="mt-2 truncate text-sm text-muted">
                        {profile.resumeOriginalName}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            downloadResume(
                              profile.id,
                              profile.resumeOriginalName ?? "resume",
                            )
                          }
                          className="btn-ghost rounded-lg px-4 py-2 text-xs"
                        >
                          {t("prof.download")}
                        </button>
                        <button
                          onClick={handleRemoveFile}
                          className="rounded-lg border border-danger/30 px-4 py-2 text-xs text-danger/80 transition hover:bg-danger/10"
                        >
                          {t("prof.remove")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-muted/60">
                      {t("prof.nothingUploaded")}
                    </p>
                  )}

                  <input
                    ref={fileInput}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFile}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInput.current?.click()}
                    disabled={uploading}
                    className="btn-primary mt-4 w-full rounded-lg py-2.5 text-xs font-semibold disabled:opacity-50"
                  >
                    {uploading
                      ? t("prof.uploading")
                      : profile.hasResumeFile
                        ? t("prof.replaceFile")
                        : t("prof.uploadFile")}
                  </button>
                  <p className="mt-3 text-xs text-muted/60">
                    {t("prof.uploadHint")}
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-panel-2 p-5">
                  <p className="text-sm font-medium text-text">
                    {t("prof.externalLink")}
                  </p>
                  {profile.resumeUrl ? (
                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="mt-2 block truncate text-sm text-brand underline underline-offset-4">{profile.resumeUrl}</a>
                  ) : (
                    <p className="mt-2 text-sm text-muted/60">
                      {t("prof.noLink")}
                    </p>
                  )}
                  <p className="mt-4 text-xs text-muted/60">
                    {t("prof.addFromEdit")}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {editing && (
          <form onSubmit={handleSubmit} className="surface mt-4 rounded-xl p-8">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted">{t("prof.headline")}</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className={field}
                    placeholder={t("prof.headlinePlaceholder")}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">{t("job.location")}</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={field}
                    placeholder={t("city.nablus")}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted">{t("prof.about")}</label>
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={field}
                  placeholder={t("prof.aboutPlaceholder")}
                />
              </div>

              <div>
                <label className="text-sm text-muted">{t("talent.skills")}</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className={field}
                  placeholder={t("prof.skillsPlaceholder")}
                />
                <p className="mt-2 text-xs text-muted/60">
                  {t("prof.skillsHint")}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted">
                    {t("prof.years")}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">{t("appl.phone")}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={field}
                    placeholder="+970 59 123 4567"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted">LinkedIn</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className={field}
                    placeholder="https://linkedin.com/in/you"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">GitHub</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className={field}
                    placeholder="https://github.com/you"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted">Portfolio</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className={field}
                    placeholder="https://yoursite.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">{t("prof.resumeLink")}</label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    className={field}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary rounded-lg px-7 py-3 font-semibold disabled:opacity-50"
              >
                {saving ? t("common.saving") : t("common.saveChanges")}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-ghost rounded-lg px-7 py-3 font-semibold"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}