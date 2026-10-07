"use client";

import { useLanguage } from "@/lib/i18n/context";

export default function LanguageToggle({
  className = "",
}: {
  className?: string;
}) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-lg border border-line bg-panel-2 ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={
          language === "en"
            ? "px-2.5 py-1 text-xs font-semibold text-text"
            : "px-2.5 py-1 text-xs font-medium text-muted transition hover:text-text"
        }
      >
        EN
      </button>
      <span className="h-4 w-px bg-line" />
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        aria-pressed={language === "ar"}
        className={
          language === "ar"
            ? "px-2.5 py-1 text-xs font-semibold text-text"
            : "px-2.5 py-1 text-xs font-medium text-muted transition hover:text-text"
        }
      >
        ع
      </button>
    </div>
  );
}
