"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
import Logo from "@/components/logo";

const linkClass =
  "text-brand underline underline-offset-4 transition hover:text-brand-soft";

export default function CandidateProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      .catch(() => setError("Could not load your profile."))
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
        setError("Could not save your changes.");
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
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function handleRemoveFile() {
    if (!confirm("Remove your uploaded resume?")) return;
    setError("");
    try {
      const updated = await removeResume();
      setProfile(updated);
    } catch {
      setError("Could not remove the file.");
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

  const initials = profile
    ? profile.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")
    : "";

  const hasLinks = Boolean(
    profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl,
  );

  return (
    <div className="relative min-h-screen">
      <header className="relative z-20 border-b border-line-soft">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <Link href="/dashboard" className="btn-ghost rounded-lg px-4 py-2 text-sm">
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-text">
              My profile
            </h1>
            <p className="mt-2 text-sm text-muted">
              {editing
                ? "Companies see this when you apply."
                : "This is what companies see with every application you send."}
            </p>
          </div>

          {!editing && (
            <button
              onClick={startEditing}
              className="btn-primary rounded-lg px-6 py-2.5 text-sm font-semibold"
            >
              Edit profile
            </button>
          )}
        </div>

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

        {!editing && profile && (
          <>
            <section className="surface mt-8 rounded-xl p-8">
              <div className="flex flex-wrap items-start gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-panel-2 font-display text-lg font-bold text-brand-soft">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-2xl font-bold text-text">
                    {profile.fullName}
                  </h2>
                  <p className="mt-1 text-muted">
                    {profile.headline ?? "No headline yet"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
                    {profile.location ? <span>{profile.location}</span> : null}
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
                  <p className="text-sm font-semibold text-brand">Skills</p>
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
              <h2 className="text-sm font-semibold text-brand">Resume</h2>
              <p className="mt-2 text-sm text-muted">
                Upload a file, link to one, or both. Companies see whichever you
                provide.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-panel-2 p-5">
                  <p className="text-sm font-medium text-text">Uploaded file</p>
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
                          Download
                        </button>
                        <button
                          onClick={handleRemoveFile}
                          className="rounded-lg border border-danger/30 px-4 py-2 text-xs text-danger/80 transition hover:bg-danger/10"
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-muted/60">
                      Nothing uploaded yet
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
                      ? "Uploading"
                      : profile.hasResumeFile
                        ? "Replace file"
                        : "Upload PDF or DOCX"}
                  </button>
                  <p className="mt-3 text-xs text-muted/60">
                    Up to 5 MB. PDF, DOC or DOCX.
                  </p>
                </div>

                <div className="rounded-lg border border-line bg-panel-2 p-5">
                  <p className="text-sm font-medium text-text">External link</p>
                  {profile.resumeUrl ? (
                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="mt-2 block truncate text-sm text-brand underline underline-offset-4">{profile.resumeUrl}</a>
                  ) : (
                    <p className="mt-2 text-sm text-muted/60">No link set</p>
                  )}
                  <p className="mt-4 text-xs text-muted/60">
                    Add or change it from Edit profile.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {editing && (
          <form onSubmit={handleSubmit} className="surface mt-8 rounded-xl p-8">
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className={field}
                    placeholder="Backend Developer"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={field}
                    placeholder="Nablus"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted">About you</label>
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={field}
                  placeholder="What you work on, what you are looking for."
                />
              </div>

              <div>
                <label className="text-sm text-muted">Skills</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className={field}
                  placeholder="NestJS, TypeScript, PostgreSQL"
                />
                <p className="mt-2 text-xs text-muted/60">
                  Separate each skill with a comma.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-muted">
                    Years of experience
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
                  <label className="text-sm text-muted">Phone</label>
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
                  <label className="text-sm text-muted">Resume link</label>
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
    </div>
  );
}
