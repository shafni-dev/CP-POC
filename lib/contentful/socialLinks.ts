import type { SocialLinkEntry, SocialPlatform } from "@/lib/sections/types";

/**
 * Raw shape of the shared `socialLinks` Contentful entry — one optional URL
 * per platform. Linked from both the navigation and footer content types.
 */
export type RawSocialLinks = {
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
} | null;

// Fixed render order; a platform with no URL is skipped. This order yields the
// nav mobile menu (FB, X, LinkedIn, IG, YouTube) and, with twitter blank, the
// footer's (FB, LinkedIn, IG, YouTube) — both matching the source site.
const ORDER: Array<[SocialPlatform, keyof NonNullable<RawSocialLinks>]> = [
  ["facebook", "facebookUrl"],
  ["twitter", "twitterUrl"],
  ["linkedin", "linkedinUrl"],
  ["instagram", "instagramUrl"],
  ["youtube", "youtubeUrl"],
];

export function mapSocialLinks(raw: RawSocialLinks): SocialLinkEntry[] {
  if (!raw) return [];
  const links: SocialLinkEntry[] = [];
  for (const [platform, key] of ORDER) {
    const href = raw[key];
    if (href) links.push({ platform, href });
  }
  return links;
}
