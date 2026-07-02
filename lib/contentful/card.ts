import type { Document } from "@contentful/rich-text-types";
import type { CardEntry, CardVariant } from "@/lib/sections/types";
import { mapImage, type RawImage } from "./image";
import { mapCta, type RawCta } from "./cta";

export type RawCard = {
  sys: { id: string };
  frontEndComponent?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  titleHref?: string | null;
  meta?: string | null;
  body?: { json: Document } | null;
  image?: RawImage;
  cta?: RawCta;
} | null;

const VARIANTS: CardVariant[] = ["media-top", "media-left", "linked", "blog"];

export function mapCard(raw: RawCard): CardEntry | null {
  if (!raw) return null;
  return {
    id: raw.sys.id,
    frontEndComponent: VARIANTS.includes(raw.frontEndComponent as CardVariant)
      ? (raw.frontEndComponent as CardVariant)
      : "media-top",
    image: mapImage(raw.image ?? null),
    eyebrow: raw.eyebrow ?? null,
    title: raw.title ?? null,
    titleHref: raw.titleHref ?? null,
    body: raw.body ?? null,
    meta: raw.meta ?? null,
    cta: mapCta(raw.cta ?? null),
  };
}
