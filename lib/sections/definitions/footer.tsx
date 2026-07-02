import { contentfulFetch } from "@/lib/contentful/client";
import { FOOTER_BY_ID } from "@/lib/contentful/graphql/queries/footer";
import { mapImage, type RawImage } from "@/lib/contentful/image";
import { mapSocialLinks, type RawSocialLinks } from "@/lib/contentful/socialLinks";
import { mapCard, type RawCard } from "@/lib/contentful/card";
import { Footer } from "@/components/sections/Footer";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type {
  FooterSection,
  StatEntry,
  NavLink,
  CardEntry,
} from "@/lib/sections/types";
import type { RichTextContent } from "@/lib/sections/types";

type RawStat = {
  sys: { id: string };
  value?: string | null;
  label?: string | null;
};

type RawNavItem = {
  sys: { id: string };
  label?: string | null;
  href?: string | null;
};

type FooterResponse = {
  footer: {
    sys: { id: string };
    frontEndComponent?: string | null;
    logo?: RawImage;
    socialLinks?: RawSocialLinks;
    phone?: string | null;
    phoneHref?: string | null;
    email?: string | null;
    emailHref?: string | null;
    address?: RichTextContent;
    charityInfoCollection?: { items?: Array<RawStat | null> | null } | null;
    legalLinksCollection?: { items?: Array<RawNavItem | null> | null } | null;
    copyright?: string | null;
    credit?: RichTextContent;
    partnerLogosCollection?: { items?: Array<RawCard> | null } | null;
    badge?: RawCard;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<FooterSection | null> {
  const data = await contentfulFetch<FooterResponse>(
    FOOTER_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.footer;
  if (!node) return null;

  const charityInfo: StatEntry[] = (node.charityInfoCollection?.items ?? [])
    .filter((s): s is RawStat => s !== null)
    .map((s) => ({ id: s.sys.id, value: s.value ?? "", label: s.label ?? "" }));

  const legalLinks: NavLink[] = (node.legalLinksCollection?.items ?? [])
    .filter((l): l is RawNavItem => l !== null)
    .map((l) => ({
      id: l.sys.id,
      label: l.label ?? "",
      href: l.href ?? null,
      children: [],
    }));

  const partnerLogos = (node.partnerLogosCollection?.items ?? [])
    .map(mapCard)
    .filter((c): c is CardEntry => c !== null);

  return {
    id: node.sys.id,
    type: "footer",
    frontEndComponent: node.frontEndComponent ?? null,
    logo: mapImage(node.logo ?? null),
    socialLinks: mapSocialLinks(node.socialLinks ?? null),
    phone: node.phone ?? null,
    phoneHref: node.phoneHref ?? null,
    email: node.email ?? null,
    emailHref: node.emailHref ?? null,
    address: node.address ?? null,
    charityInfo,
    legalLinks,
    copyright: node.copyright ?? null,
    credit: node.credit ?? null,
    partnerLogos,
    badge: mapCard(node.badge ?? null),
  };
}

export const footerDefinition: SectionDefinition = {
  contentfulTypename: "Footer",
  type: "footer",
  hydrate,
  render: (section) => <Footer section={section as FooterSection} />,
};
