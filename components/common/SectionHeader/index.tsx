import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string | null;
  heading: string;
  intro?: ReactNode;
  align?: "left" | "center";
  /** Orange divider under the heading (uk-heading-divider). Defaults to true. */
  divider?: boolean;
  className?: string;
};

/**
 * Eyebrow (uk-text-lead) + H2 (uk-heading-small, optional orange divider) +
 * optional intro. Used by Mission, Explore, Latest News.
 */
export function SectionHeader({
  eyebrow,
  heading,
  intro,
  align = "left",
  divider = true,
  className = "",
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <header className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <p className="text-[18px] font-normal uppercase tracking-[4px] text-[var(--brand-primary)] font-[family-name:var(--font-poppins)]">
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-2 text-[33px] font-semibold uppercase leading-[1.05] text-[var(--brand-primary)] font-[family-name:var(--font-poppins)] ${
          divider ? "border-b-2 border-[var(--brand-accent)] pb-2" : ""
        }`}
      >
        {heading}
      </h2>
      {intro && (
        <div className="mt-4 max-w-[70ch] text-[16px] leading-relaxed text-[var(--text-default)]">
          {intro}
        </div>
      )}
    </header>
  );
}
