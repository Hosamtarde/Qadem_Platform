"use client";

import { useT } from "@/lib/i18n/context";

export default function BuiltAtWahj() {
  const t = useT();

  return (
    <section className="border-b border-line-soft py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <p className="text-xs tracking-[0.2em] text-muted">
          {t("wahj.kicker")}
        </p>

        <a
          href="https://wahj.co"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-lg opacity-90 transition hover:opacity-100"
        >
          <img src="/wahj-logo.svg" alt="Wahj" className="h-11 w-auto" />
        </a>

        <p className="max-w-lg text-sm leading-relaxed text-muted">
          {t("wahj.body")}
        </p>
      </div>
    </section>
  );
}
