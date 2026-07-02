import type { CtaEntry, CtaVariant } from "@/lib/sections/types";

export type RawCta = {
  sys: { id: string };
  label?: string | null;
  href?: string | null;
  variant?: string | null;
  ariaLabel?: string | null;
  target?: string | null;
} | null;

const VARIANTS: CtaVariant[] = ["default", "primary", "donate"];

export function mapCta(raw: RawCta): CtaEntry | null {
  if (!raw) return null;
  return {
    id: raw.sys.id,
    label: raw.label ?? "",
    href: raw.href ?? null,
    variant: VARIANTS.includes(raw.variant as CtaVariant)
      ? (raw.variant as CtaVariant)
      : "default",
    ariaLabel: raw.ariaLabel ?? null,
    target: raw.target === "_blank" ? "_blank" : "_self",
  };
}
