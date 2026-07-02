import { contentfulFetch } from "@/lib/contentful/client";
import { IMPACT_STATS_BY_ID } from "@/lib/contentful/graphql/queries/impactStats";
import { mapImage, type RawImage } from "@/lib/contentful/image";
import { mapCta, type RawCta } from "@/lib/contentful/cta";
import { ImpactStats } from "@/components/sections/ImpactStats";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type { ImpactStatsSection, StatEntry } from "@/lib/sections/types";

type RawStat = {
  sys: { id: string };
  value?: string | null;
  label?: string | null;
};

type ImpactStatsResponse = {
  impactStats: {
    sys: { id: string };
    frontEndComponent?: string | null;
    sectionId?: string | null;
    heading?: string | null;
    image?: RawImage;
    statsCollection?: { items?: Array<RawStat | null> | null } | null;
    cta?: RawCta;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<ImpactStatsSection | null> {
  const data = await contentfulFetch<ImpactStatsResponse>(
    IMPACT_STATS_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.impactStats;
  if (!node) return null;

  const stats: StatEntry[] = (node.statsCollection?.items ?? [])
    .filter((s): s is RawStat => s !== null)
    .map((s) => ({
      id: s.sys.id,
      value: s.value ?? "",
      label: s.label ?? "",
    }));

  return {
    id: node.sys.id,
    type: "impactStats",
    frontEndComponent: node.frontEndComponent ?? null,
    sectionId: node.sectionId ?? null,
    heading: node.heading ?? "",
    image: mapImage(node.image ?? null),
    stats,
    cta: mapCta(node.cta ?? null),
  };
}

export const impactStatsDefinition: SectionDefinition = {
  contentfulTypename: "ImpactStats",
  type: "impactStats",
  hydrate,
  render: (section) => <ImpactStats section={section as ImpactStatsSection} />,
};
