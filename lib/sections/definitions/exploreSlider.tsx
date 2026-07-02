import { contentfulFetch } from "@/lib/contentful/client";
import { EXPLORE_SLIDER_BY_ID } from "@/lib/contentful/graphql/queries/exploreSlider";
import { mapCard, type RawCard } from "@/lib/contentful/card";
import { ExploreSlider } from "@/components/sections/ExploreSlider";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type { ExploreSliderSection, CardEntry } from "@/lib/sections/types";

type ExploreSliderResponse = {
  exploreSlider: {
    sys: { id: string };
    frontEndComponent?: string | null;
    sectionId?: string | null;
    eyebrow?: string | null;
    heading?: string | null;
    cardsCollection?: { items?: Array<RawCard> | null } | null;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<ExploreSliderSection | null> {
  const data = await contentfulFetch<ExploreSliderResponse>(
    EXPLORE_SLIDER_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.exploreSlider;
  if (!node) return null;

  const cards = (node.cardsCollection?.items ?? [])
    .map(mapCard)
    .filter((c): c is CardEntry => c !== null);

  return {
    id: node.sys.id,
    type: "exploreSlider",
    frontEndComponent: node.frontEndComponent ?? null,
    sectionId: node.sectionId ?? null,
    eyebrow: node.eyebrow ?? null,
    heading: node.heading ?? "",
    cards,
  };
}

export const exploreSliderDefinition: SectionDefinition = {
  contentfulTypename: "ExploreSlider",
  type: "exploreSlider",
  hydrate,
  render: (section) => <ExploreSlider section={section as ExploreSliderSection} />,
};
