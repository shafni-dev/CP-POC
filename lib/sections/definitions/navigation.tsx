import { contentfulFetch } from "@/lib/contentful/client";
import { NAVIGATION_BY_ID } from "@/lib/contentful/graphql/queries/navigation";
import { mapSocialLinks, type RawSocialLinks } from "@/lib/contentful/socialLinks";
import { Navigation } from "@/components/sections/Navigation";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type { NavigationSection, NavLink } from "@/lib/sections/types";

type RawNavItem = {
  sys: { id: string };
  label?: string | null;
  href?: string | null;
  childItemsCollection?: {
    items?: Array<{
      sys: { id: string };
      label?: string | null;
      href?: string | null;
    } | null> | null;
  } | null;
};

type NavigationResponse = {
  navigation: {
    sys: { id: string };
    frontEndComponent?: string | null;
    logo?: {
      url?: string | null;
      title?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    logoWidth?: number | null;
    logoHeight?: number | null;
    donateLabel?: string | null;
    donateHref?: string | null;
    socialLinks?: RawSocialLinks;
    itemsCollection?: { items?: Array<RawNavItem | null> | null } | null;
  } | null;
};

const mapItem = (raw: RawNavItem): NavLink => ({
  id: raw.sys.id,
  label: raw.label ?? "",
  href: raw.href ?? null,
  children: (raw.childItemsCollection?.items ?? [])
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .map((c) => ({
      id: c.sys.id,
      label: c.label ?? "",
      href: c.href ?? null,
      children: [],
    })),
});

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<NavigationSection | null> {
  const data = await contentfulFetch<NavigationResponse>(
    NAVIGATION_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.navigation;
  if (!node) return null;

  return {
    id: node.sys.id,
    type: "navigation",
    frontEndComponent: node.frontEndComponent ?? null,
    logo: node.logo?.url
      ? {
          url: node.logo.url,
          title: node.logo.title ?? null,
          width: node.logo.width ?? null,
          height: node.logo.height ?? null,
        }
      : null,
    logoWidth: node.logoWidth ?? null,
    logoHeight: node.logoHeight ?? null,
    donateLabel: node.donateLabel ?? null,
    donateHref: node.donateHref ?? null,
    items: (node.itemsCollection?.items ?? [])
      .filter((i): i is RawNavItem => i !== null)
      .map(mapItem),
    socialLinks: mapSocialLinks(node.socialLinks ?? null),
  };
}

export const navigationDefinition: SectionDefinition = {
  contentfulTypename: "Navigation",
  type: "navigation",
  hydrate,
  render: (section) => <Navigation section={section as NavigationSection} />,
};
