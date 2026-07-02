import { contentfulFetch } from "@/lib/contentful/client";
import { NEWSLETTER_SIGNUP_BY_ID } from "@/lib/contentful/graphql/queries/newsletterSignup";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { mapCta, type RawCta } from "@/lib/contentful/cta";
import type { SectionDefinition, HydrateOptions } from "@/lib/sections/config";
import type {
  NewsletterSignupSection,
  RichTextContent,
} from "@/lib/sections/types";

type NewsletterSignupResponse = {
  newsletterSignup: {
    sys: { id: string };
    frontEndComponent?: string | null;
    sectionId?: string | null;
    heading?: string | null;
    body?: RichTextContent;
    modalBody?: RichTextContent;
    brevoFormAction?: string | null;
    brevoRecaptchaSiteKey?: string | null;
    cta?: RawCta;
  } | null;
};

async function hydrate(
  id: string,
  options: HydrateOptions
): Promise<NewsletterSignupSection | null> {
  const data = await contentfulFetch<NewsletterSignupResponse>(
    NEWSLETTER_SIGNUP_BY_ID,
    { id, preview: options.preview ?? false, locale: options.locale },
    { preview: options.preview }
  );
  const node = data.newsletterSignup;
  if (!node) return null;

  return {
    id: node.sys.id,
    type: "newsletterSignup",
    frontEndComponent: node.frontEndComponent ?? null,
    sectionId: node.sectionId ?? null,
    heading: node.heading ?? "",
    body: node.body ?? null,
    modalBody: node.modalBody ?? null,
    brevoFormAction: node.brevoFormAction ?? null,
    brevoRecaptchaSiteKey: node.brevoRecaptchaSiteKey ?? null,
    cta: mapCta(node.cta ?? null),
  };
}

export const newsletterSignupDefinition: SectionDefinition = {
  contentfulTypename: "NewsletterSignup",
  type: "newsletterSignup",
  hydrate,
  render: (section) => (
    <NewsletterSignup section={section as NewsletterSignupSection} />
  ),
};
