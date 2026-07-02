import { contentfulFetch } from "@/lib/contentful/client";
import { LATEST_NEWS_BY_ID } from "@/lib/contentful/graphql/queries/latestNews";
import { mapCard, type RawCard } from "@/lib/contentful/card";
import { LatestNews } from "@/components/sections/LatestNews";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type { LatestNewsSection, CardEntry } from "@/lib/sections/types";

type LatestNewsResponse = {
  latestNews: {
    sys: { id: string };
    frontEndComponent?: string | null;
    eyebrow?: string | null;
    heading?: string | null;
    sectionId?: string | null;
    cardsCollection?: { items?: Array<RawCard> | null } | null;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<LatestNewsSection | null> {
  const data = await contentfulFetch<LatestNewsResponse>(
    LATEST_NEWS_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.latestNews;
  if (!node) return null;

  const cards = (node.cardsCollection?.items ?? [])
    .map(mapCard)
    .filter((c): c is CardEntry => c !== null);

  return {
    id: node.sys.id,
    type: "latestNews",
    frontEndComponent: node.frontEndComponent ?? null,
    eyebrow: node.eyebrow ?? null,
    heading: node.heading ?? null,
    sectionId: node.sectionId ?? null,
    cards,
  };
}

export const latestNewsDefinition: SectionDefinition = {
  contentfulTypename: "LatestNews",
  type: "latestNews",
  hydrate,
  render: (section) => <LatestNews section={section as LatestNewsSection} />,
};
