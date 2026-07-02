import { contentfulFetch } from "@/lib/contentful/client";
import { HERO_SLIDER_BY_ID } from "@/lib/contentful/graphql/queries/heroSlider";
import { mapCard, type RawCard } from "@/lib/contentful/card";
import { HeroSlider } from "@/components/sections/HeroSlider";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type { HeroSliderSection, CardEntry } from "@/lib/sections/types";

type HeroSliderResponse = {
  heroSlider: {
    sys: { id: string };
    frontEndComponent?: string | null;
    sectionId?: string | null;
    slidesCollection?: { items?: Array<RawCard> | null } | null;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<HeroSliderSection | null> {
  const data = await contentfulFetch<HeroSliderResponse>(
    HERO_SLIDER_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.heroSlider;
  if (!node) return null;

  const slides = (node.slidesCollection?.items ?? [])
    .map(mapCard)
    .filter((c): c is CardEntry => c !== null);

  return {
    id: node.sys.id,
    type: "heroSlider",
    frontEndComponent: node.frontEndComponent ?? null,
    sectionId: node.sectionId ?? null,
    slides,
  };
}

export const heroSliderDefinition: SectionDefinition = {
  contentfulTypename: "HeroSlider",
  type: "heroSlider",
  hydrate,
  render: (section) => <HeroSlider section={section as HeroSliderSection} />,
};
