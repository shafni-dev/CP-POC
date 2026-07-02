import { contentfulFetch } from "@/lib/contentful/client";
import { DONATION_CTA_BY_ID } from "@/lib/contentful/graphql/queries/donationCta";
import { mapCta, type RawCta } from "@/lib/contentful/cta";
import { DonationCta } from "@/components/sections/DonationCta";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type { DonationCtaSection, RichTextContent } from "@/lib/sections/types";

type RawImage = {
  url?: string | null;
  title?: string | null;
  description?: string | null;
  width?: number | null;
  height?: number | null;
} | null;

type DonationCtaResponse = {
  donationCta: {
    sys: { id: string };
    frontEndComponent?: string | null;
    sectionId?: string | null;
    heading?: string | null;
    subheading?: string | null;
    body?: RichTextContent;
    cta?: RawCta;
    photoCredit?: string | null;
    image?: RawImage;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<DonationCtaSection | null> {
  const data = await contentfulFetch<DonationCtaResponse>(
    DONATION_CTA_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.donationCta;
  if (!node) return null;

  return {
    id: node.sys.id,
    type: "donationCta",
    frontEndComponent: node.frontEndComponent ?? null,
    sectionId: node.sectionId ?? null,
    heading: node.heading ?? "",
    subheading: node.subheading ?? null,
    body: node.body ?? null,
    cta: mapCta(node.cta ?? null),
    photoCredit: node.photoCredit ?? null,
    image: {
      url: node.image?.url ?? null,
      width: node.image?.width ?? null,
      height: node.image?.height ?? null,
      title: node.image?.title ?? null,
      alt: node.image?.description ?? node.image?.title ?? null,
    },
  };
}

export const donationCtaDefinition: SectionDefinition = {
  contentfulTypename: "DonationCta",
  type: "donationCta",
  hydrate,
  render: (section) => <DonationCta section={section as DonationCtaSection} />,
};
