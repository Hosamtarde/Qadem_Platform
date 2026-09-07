"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getMyCompany, updateMyCompany } from "@/lib/companies";
import { ApiRequestError } from "@/lib/api";
import { Company } from "@/lib/types";

export default function CompanyProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
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
    getMyCompany()
      .then((c) => {
        setCompany(c);
        setName(c.name);
        setDescription(c.description ?? "");
        setWebsite(c.website ?? "");
        setLocation(c.location ?? "");
      })
      .catch(() => setError("Could not load your company profile."))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const updated = await updateMyCompany({
        name,
        description: description || undefined,
        website: website || undefined,
        location: location || undefined,
      });
      setCompany(updated);
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
    "mt-2 w-full rounded-lg border border-line bg-night/60 px-4 py-3 text-chalk placeholder:text-fog/35 outline-none transition focus:border-gold/70";

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-fog">Loading</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="halo" />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-7">
        <Link href="/dashboard" className="font-display text-2xl text-chalk">
          Job Platform
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-line px-4 py-2 text-sm text-fog transition hover:text-chalk"
        >
          Back
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24">
        <h1 className="rise rise-1 font-display text-5xl text-chalk">
          Company profile
        </h1>
        <p className="rise rise-1 mt-3 text-fog">
          This is what candidates see next to your openings.
        </p>

        <form onSubmit={handleSubmit} className="rise rise-2 panel mt-10 rounded-xl p-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-fog">Company name</label>
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
              <label className="text-sm text-fog">About the company</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={field}
                placeholder="What your company does, who works there, what you are building."
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm text-fog">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={field}
                  placeholder="Nablus"
                />
              </div>

              <div>
                <label className="text-sm text-fog">Website</label>
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
            <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          {saved && (
            <p className="mt-6 rounded-lg border border-jade/30 bg-jade/10 px-4 py-3 text-sm text-jade">
              Profile saved
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-8 rounded-lg bg-gold px-6 py-3 font-semibold text-night transition hover:bg-gold-soft disabled:opacity-50"
          >
            {saving ? "Saving" : "Save changes"}
          </button>
        </form>

        {company && (
          <p className="mt-6 text-xs text-fog/50">
            Profile identifier: {company.id}
          </p>
        )}
      </main>
    </div>
  );
}
