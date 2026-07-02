import { contentfulFetch } from "@/lib/contentful/client";
import { MISSION_STATEMENT_BY_ID } from "@/lib/contentful/graphql/queries/missionStatement";
import { MissionStatement } from "@/components/sections/MissionStatement";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type {
  MissionStatementSection,
  RichTextContent,
  StatEntry,
} from "@/lib/sections/types";

type RawStat = {
  sys: { id: string };
  value?: string | null;
  label?: string | null;
};

type MissionStatementResponse = {
  missionStatement: {
    sys: { id: string };
    frontEndComponent?: string | null;
    eyebrow?: string | null;
    heading?: string | null;
    body?: RichTextContent;
    statsCollection?: { items?: Array<RawStat | null> | null } | null;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<MissionStatementSection | null> {
  const data = await contentfulFetch<MissionStatementResponse>(
    MISSION_STATEMENT_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.missionStatement;
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
    type: "missionStatement",
    frontEndComponent: node.frontEndComponent ?? null,
    eyebrow: node.eyebrow ?? null,
    heading: node.heading ?? "",
    body: node.body ?? null,
    stats,
  };
}

export const missionStatementDefinition: SectionDefinition = {
  contentfulTypename: "MissionStatement",
  type: "missionStatement",
  hydrate,
  render: (section) => (
    <MissionStatement section={section as MissionStatementSection} />
  ),
};
