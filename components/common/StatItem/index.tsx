type StatItemProps = {
  value: string;
  label: string;
  /** `grid` = large stacked number over label (Impact); `inline` = chevron + value + label (Mission). */
  size?: "grid" | "inline";
  className?: string;
};

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className={className} fill="none">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A single statistic: a large number and its label. `grid` stacks a big
 * uk-h1-sized number over the label; `inline` renders a chevron-led row.
 */
export function StatItem({ value, label, size = "grid", className = "" }: StatItemProps) {
  if (size === "inline") {
    return (
      <div className={`flex items-baseline gap-3 ${className}`}>
        <Chevron className="shrink-0 translate-y-1 text-[var(--brand-accent)]" />
        <span className="text-[22px] font-semibold text-[var(--brand-primary)] font-[family-name:var(--font-poppins)]">
          {value}
        </span>
        <span className="text-[16px] text-[var(--text-default)]">{label}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-[44px] font-semibold uppercase leading-none text-[var(--brand-primary)] font-[family-name:var(--font-poppins)]">
        {value}
      </span>
      <span className="mt-2 text-[16px] leading-snug text-[var(--text-default)]">
        {label}
      </span>
    </div>
  );
}
