import { contentfulFetch } from "@/lib/contentful/client";
import { COUNTRY_CARDS_BY_ID } from "@/lib/contentful/graphql/queries/countryCards";
import { mapCard, type RawCard } from "@/lib/contentful/card";
import { CountryCards } from "@/components/sections/CountryCards";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type { CountryCardsSection, CardEntry } from "@/lib/sections/types";

type CountryCardsResponse = {
  countryCards: {
    sys: { id: string };
    frontEndComponent?: string | null;
    sectionId?: string | null;
    cardsCollection?: { items?: Array<RawCard> | null } | null;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<CountryCardsSection | null> {
  const data = await contentfulFetch<CountryCardsResponse>(
    COUNTRY_CARDS_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.countryCards;
  if (!node) return null;

  const cards = (node.cardsCollection?.items ?? [])
    .map(mapCard)
    .filter((c): c is CardEntry => c !== null);

  return {
    id: node.sys.id,
    type: "countryCards",
    frontEndComponent: node.frontEndComponent ?? null,
    sectionId: node.sectionId ?? null,
    cards,
  };
}

export const countryCardsDefinition: SectionDefinition = {
  contentfulTypename: "CountryCards",
  type: "countryCards",
  hydrate,
  render: (section) => <CountryCards section={section as CountryCardsSection} />,
};
