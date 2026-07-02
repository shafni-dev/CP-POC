type StatItemProps = {
  value: string;
  label: string;
  /** `grid` = large stacked number over label (Impact); `inline` = chevron + value + label (Mission). */
  size?: "grid" | "inline";
  /** `brand` = purple number on light bg; `light` = white number+label for use on the purple panel (Impact). */
  tone?: "brand" | "light";
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
export function StatItem({
  value,
  label,
  size = "grid",
  tone = "brand",
  className = "",
}: StatItemProps) {
  if (size === "inline") {
    return (
      <div className={`flex gap-[10px] ${className}`}>
        <Chevron className="mt-[4px] shrink-0 text-[var(--brand-accent)]" />
        <p className="m-0 text-[16.5px] leading-[1.5] text-[var(--text-default)] font-[family-name:var(--font-poppins)]">
          <strong className="font-bold">{value}</strong> {label}
        </p>
      </div>
    );
  }

  const numberColor = tone === "light" ? "text-white" : "text-[var(--brand-primary)]";
  const labelColor = tone === "light" ? "text-white" : "text-[var(--text-default)]";

  return (
    <div className={`flex flex-col ${className}`}>
      <span
        className={`text-[44px] font-bold uppercase leading-[1.2] font-[family-name:var(--font-poppins)] ${numberColor}`}
      >
        {value}
      </span>
      <span
        className={`mt-[10px] text-[18px] font-normal uppercase leading-[1.5] tracking-[4px] font-[family-name:var(--font-poppins)] ${labelColor}`}
      >
        {label}
      </span>
    </div>
  );
}
