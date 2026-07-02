import Link from "next/link";
import type { ReactNode } from "react";
import type { CtaEntry, CtaVariant } from "@/lib/sections/types";

function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" width="16" height="16" aria-hidden="true" className={className} fill="currentColor">
      <g transform="translate(0 30)">
        <path d="M471.383 44.578C444.879 15.832 408.512 0 368.973 0c-29.555 0-56.621 9.344-80.45 27.77C276.5 37.07 265.605 48.45 256 61.73c-9.602-13.277-20.5-24.66-32.527-33.96C199.648 9.344 172.582 0 143.027 0c-39.539 0-75.91 15.832-102.414 44.578C14.426 72.988 0 111.801 0 153.871c0 43.3 16.137 82.938 50.781 124.742 30.992 37.395 75.535 75.356 127.117 119.313 17.614 15.012 37.579 32.027 58.309 50.152A30.023 30.023 0 0 0 256 455.516c7.285 0 14.316-2.641 19.785-7.43 20.73-18.129 40.707-35.152 58.328-50.172 51.575-43.95 96.117-81.906 127.11-119.305C495.867 236.81 512 197.172 512 153.867c0-42.066-14.426-80.879-40.617-109.289zm0 0" />
      </g>
    </svg>
  );
}

const BASE =
  "inline-flex h-11 items-center justify-center gap-2 text-[15.5px] transition-colors font-[family-name:var(--font-poppins)]";

const VARIANT: Record<CtaVariant, string> = {
  // outlined ghost — orange, turns purple on hover (used inside cards)
  default:
    "px-[30px] font-semibold border-2 border-[var(--brand-accent)] bg-transparent text-[var(--brand-accent)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]",
  // solid purple
  primary:
    "px-[30px] font-semibold border-2 border-transparent bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]",
  // branded pill Donate with heart
  donate:
    "px-5 font-bold uppercase tracking-[1.5px] rounded-full border-2 border-transparent bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]",
};

type CtaProps = {
  cta: CtaEntry | null | undefined;
  className?: string;
};

export function Cta({ cta, className = "" }: CtaProps) {
  if (!cta || !cta.label) return null;

  const classes = `${BASE} ${VARIANT[cta.variant]} ${className}`.trim();
  const children: ReactNode = (
    <>
      {cta.variant === "donate" && <Heart />}
      {cta.label}
    </>
  );

  const href = cta.href ?? "#";
  const isExternal = /^https?:\/\//.test(href) || cta.target === "_blank";

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={cta.ariaLabel ?? undefined}
        target={cta.target}
        rel={cta.target === "_blank" ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={cta.ariaLabel ?? undefined}>
      {children}
    </Link>
  );
}
