interface Props {
  className?: string;
  showText?: boolean;
}

export function QademMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="55 14"
        transform="rotate(-58 16 16)"
      />
      <circle cx="27" cy="7" r="2.6" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ className = "", showText = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <QademMark className="h-7 w-7 text-brand" />
      {showText && (
        <span className="font-display text-xl font-bold tracking-tight text-text">
          Qadem
        </span>
      )}
    </span>
  );
}
