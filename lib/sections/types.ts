import type { Document } from "@contentful/rich-text-types";

export type ImageAsset = {
  url: string | null;
  width?: number | null;
  height?: number | null;
};

export type RichTextContent = {
  json: Document;
} | null;

/* ---- Shared reusable reference entries (linked from sections) ---- */

export type ImageEntry = {
  id: string;
  url: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
  contentType: string | null;
  loading: "eager" | "lazy";
};

export type CtaVariant =
  | "default"
  | "primary"
  | "donate"
  | "ghost-accent"
  | "ghost";

export type CtaEntry = {
  id: string;
  label: string;
  href: string | null;
  variant: CtaVariant;
  ariaLabel: string | null;
  target: "_self" | "_blank";
};

export type VideoEntry = {
  id: string;
  youtubeId: string | null;
  videoTitle: string | null;
  caption: string | null;
};

export type CardVariant = "media-top" | "media-left" | "linked" | "blog";

export type CardEntry = {
  id: string;
  frontEndComponent: CardVariant;
  image: ImageEntry | null;
  eyebrow: string | null;
  title: string | null;
  titleHref: string | null;
  body: RichTextContent;
  meta: string | null;
  cta: CtaEntry | null;
};

export type SeoEntry = {
  sys: { id: string };
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoOgImage?: ImageAsset | null;
  seoNoIndex?: boolean | null;
  seoNoFollow?: boolean | null;
  seoCanonicalUrl?: string | null;
  seoSchemaMarkup?: unknown | null;
};

/**
 * Every concrete section extends BaseSection and sets a unique `type` literal.
 * Add your section types to the `Section` union below as you build them out.
 * See `components/ARCHITECTURE.md` for the full pattern.
 */
export type BaseSection = {
  id: string;
  type: string;
};

export type UnknownSection = BaseSection & {
  type: "unknown";
  raw: unknown;
};

export type NavLink = {
  id: string;
  label: string;
  href: string | null;
  children: NavLink[];
};

export type SocialPlatform =
  | "facebook"
  | "twitter"
  | "linkedin"
  | "instagram"
  | "youtube";

/**
 * A single social link. Shared by the shared `socialLinks` Contentful entry,
 * consumed by both the Navigation (mobile menu) and Footer sections.
 * Structurally matches the `SocialLink` prop type of the SocialLinks component.
 */
export type SocialLinkEntry = {
  platform: SocialPlatform;
  href: string;
};

export type NavigationSection = BaseSection & {
  type: "navigation";
  frontEndComponent: string | null;
  logo: (ImageAsset & { title?: string | null }) | null;
  logoWidth: number | null;
  logoHeight: number | null;
  donateLabel: string | null;
  donateHref: string | null;
  items: NavLink[];
  socialLinks: SocialLinkEntry[];
};

export type StatEntry = {
  id: string;
  value: string;
  label: string;
};

export type HeroSliderSection = BaseSection & {
  type: "heroSlider";
  frontEndComponent: string | null;
  sectionId: string | null;
  slides: CardEntry[];
};

export type MissionStatementSection = BaseSection & {
  type: "missionStatement";
  frontEndComponent: string | null;
  eyebrow: string | null;
  heading: string;
  body: RichTextContent;
  stats: StatEntry[];
};

export type CountryCardsSection = BaseSection & {
  type: "countryCards";
  frontEndComponent: string | null;
  sectionId: string | null;
  cards: CardEntry[];
};

export type ImpactStatsSection = BaseSection & {
  type: "impactStats";
  frontEndComponent: string | null;
  sectionId: string | null;
  heading: string;
  image: ImageEntry | null;
  stats: StatEntry[];
  cta: CtaEntry | null;
};

export type ExploreSliderSection = BaseSection & {
  type: "exploreSlider";
  frontEndComponent: string | null;
  sectionId: string | null;
  eyebrow: string | null;
  heading: string;
  cards: CardEntry[];
};

export type DonationCtaSection = BaseSection & {
  type: "donationCta";
  frontEndComponent: string | null;
  sectionId: string | null;
  heading: string;
  subheading: string | null;
  body: RichTextContent;
  cta: CtaEntry | null;
  photoCredit: string | null;
  image: ImageAsset & { title?: string | null; alt?: string | null };
};

export type LegendColor = "orange" | "purple" | "grey";

export type LegendItemEntry = {
  id: string;
  label: string;
  percentage: string;
  color: LegendColor;
};

export type SpendingAndVideoSection = BaseSection & {
  type: "spendingAndVideo";
  frontEndComponent: string | null;
  sectionId: string | null;
  heading: string;
  body: RichTextContent;
  chart: (ImageAsset & { alt: string | null }) | null;
  legend: LegendItemEntry[];
  video: VideoEntry | null;
};

export type LatestNewsSection = BaseSection & {
  type: "latestNews";
  frontEndComponent: string | null;
  eyebrow: string | null;
  heading: string | null;
  sectionId: string | null;
  cards: CardEntry[];
};

export type NewsletterSignupSection = BaseSection & {
  type: "newsletterSignup";
  frontEndComponent: string | null;
  sectionId: string | null;
  heading: string;
  body: RichTextContent;
  modalBody: RichTextContent;
  brevoFormAction: string | null;
  brevoRecaptchaSiteKey: string | null;
  cta: CtaEntry | null;
};

export type FooterSection = BaseSection & {
  type: "footer";
  frontEndComponent: string | null;
  logo: ImageEntry | null;
  socialLinks: SocialLinkEntry[];
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  emailHref: string | null;
  address: RichTextContent;
  charityInfo: StatEntry[];
  legalLinks: NavLink[];
  copyright: string | null;
  credit: RichTextContent;
  partnerLogos: CardEntry[];
  badge: CardEntry | null;
};

export type Section =
  | UnknownSection
  | NavigationSection
  | FooterSection
  | HeroSliderSection
  | MissionStatementSection
  | CountryCardsSection
  | ExploreSliderSection
  | DonationCtaSection
  | SpendingAndVideoSection
  | LatestNewsSection
  | NewsletterSignupSection
  | ImpactStatsSection;
