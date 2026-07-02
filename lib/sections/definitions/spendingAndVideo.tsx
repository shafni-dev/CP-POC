import { contentfulFetch } from "@/lib/contentful/client";
import { SPENDING_AND_VIDEO_BY_ID } from "@/lib/contentful/graphql/queries/spendingAndVideo";
import { mapVideo, type RawVideo } from "@/lib/contentful/video";
import { SpendingAndVideo } from "@/components/sections/SpendingAndVideo";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type {
  SpendingAndVideoSection,
  LegendItemEntry,
  LegendColor,
  RichTextContent,
} from "@/lib/sections/types";

type RawLegendItem = {
  sys: { id: string };
  label?: string | null;
  percentage?: string | null;
  color?: string | null;
};

type SpendingAndVideoResponse = {
  spendingAndVideo: {
    sys: { id: string };
    frontEndComponent?: string | null;
    sectionId?: string | null;
    heading?: string | null;
    body?: RichTextContent;
    chartImage?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      title?: string | null;
    } | null;
    chartAlt?: string | null;
    legendCollection?: { items?: Array<RawLegendItem | null> | null } | null;
    video?: RawVideo;
  } | null;
};

const LEGEND_COLORS: LegendColor[] = ["orange", "purple", "grey"];

function toLegendColor(value: string | null | undefined): LegendColor {
  return LEGEND_COLORS.includes(value as LegendColor)
    ? (value as LegendColor)
    : "grey";
}

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<SpendingAndVideoSection | null> {
  const data = await contentfulFetch<SpendingAndVideoResponse>(
    SPENDING_AND_VIDEO_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.spendingAndVideo;
  if (!node) return null;

  const legend: LegendItemEntry[] = (node.legendCollection?.items ?? [])
    .filter((i): i is RawLegendItem => i !== null)
    .map((i) => ({
      id: i.sys.id,
      label: i.label ?? "",
      percentage: i.percentage ?? "",
      color: toLegendColor(i.color),
    }));

  const chart = node.chartImage?.url
    ? {
        url: node.chartImage.url,
        width: node.chartImage.width ?? null,
        height: node.chartImage.height ?? null,
        alt: node.chartAlt ?? node.chartImage.title ?? null,
      }
    : null;

  return {
    id: node.sys.id,
    type: "spendingAndVideo",
    frontEndComponent: node.frontEndComponent ?? null,
    sectionId: node.sectionId ?? null,
    heading: node.heading ?? "",
    body: node.body ?? null,
    chart,
    legend,
    video: mapVideo(node.video ?? null),
  };
}

export const spendingAndVideoDefinition: SectionDefinition = {
  contentfulTypename: "SpendingAndVideo",
  type: "spendingAndVideo",
  hydrate,
  render: (section) => (
    <SpendingAndVideo section={section as SpendingAndVideoSection} />
  ),
};
