"use client";

import { useT } from "@/lib/i18n/context";

export default function ResponseBadge({
  rate,
  avgDays,
  sampleSize,
  size = "sm",
}: {
  rate: number | null | undefined;
  avgDays: number | null | undefined;
  sampleSize?: number;
  size?: "sm" | "md";
}) {
  const t = useT();

  if (rate == null) {
    return (
      <span
        className={
          size === "md"
            ? "inline-flex items-center gap-1.5 rounded-md border border-line bg-panel-2 px-2.5 py-1 text-xs text-muted/70"
            : "inline-flex items-center gap-1.5 rounded-md border border-line bg-panel-2 px-2 py-0.5 text-[10px] text-muted/60"
        }
      >
        <svg
          width={size === "md" ? 13 : 11}
          height={size === "md" ? 13 : 11}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        {t("score.tooFew")}
      </span>
    );
  }

  const tone =
    rate >= 70
      ? { text: "text-success", bg: "bg-success/10", ring: "ring-success/25" }
      : rate >= 40
        ? { text: "text-brand", bg: "bg-brand/10", ring: "ring-brand/25" }
        : { text: "text-muted", bg: "bg-panel-2", ring: "ring-line" };

  const md = size === "md";

  return (
    <span
      className={`inline-flex items-stretch overflow-hidden rounded-md ring-1 ${tone.ring} ${tone.bg}`}
      title={
        sampleSize
          ? t("score.basedOn", { count: sampleSize })
          : t("score.title")
      }
    >
      <span
        className={
          md
            ? "flex items-center gap-2 px-3 py-1.5"
            : "flex items-center gap-1.5 px-2 py-1"
        }
      >
        <span
          className={
            md
              ? `text-sm font-bold tabular-nums ${tone.text}`
              : `text-xs font-bold tabular-nums ${tone.text}`
          }
        >
          {rate}%
        </span>
        <span
          className={
            md
              ? "text-[10px] font-medium uppercase tracking-wide text-muted/70"
              : "text-[9px] font-medium uppercase tracking-wide text-muted/60"
          }
        >
          {t("score.replied")}
        </span>
      </span>

      {avgDays != null && (
        <>
          <span className="w-px bg-line/60" />
          <span
            className={
              md
                ? "flex items-center gap-2 px-3 py-1.5"
                : "flex items-center gap-1.5 px-2 py-1"
            }
          >
            <span
              className={
                md
                  ? "text-sm font-bold tabular-nums text-text"
                  : "text-xs font-bold tabular-nums text-text"
              }
            >
              {avgDays < 1 ? "<1" : Math.round(avgDays)}
            </span>
            <span
              className={
                md
                  ? "text-[10px] font-medium uppercase tracking-wide text-muted/70"
                  : "text-[9px] font-medium uppercase tracking-wide text-muted/60"
              }
            >
              {avgDays < 1 || Math.round(avgDays) === 1
                ? t("score.day")
                : t("score.days")}
            </span>
          </span>
        </>
      )}
    </span>
  );
}