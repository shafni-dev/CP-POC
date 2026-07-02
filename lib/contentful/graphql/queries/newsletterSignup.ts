import { CTA_FRAGMENT } from "../fragments/cta";

/**
 * Hydrate query for a `newsletterSignup` section. The Subscribe button reuses
 * the shared `cta` entry, so we spread `...CtaFields` and prepend its fragment.
 */
export const NEWSLETTER_SIGNUP_BY_ID = /* GraphQL */ `
  ${CTA_FRAGMENT}
  query NewsletterSignupById($id: String!, $preview: Boolean, $locale: String) {
    newsletterSignup(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      sectionId
      heading
      body {
        json
      }
      modalBody {
        json
      }
      brevoFormAction
      brevoRecaptchaSiteKey
      cta {
        ...CtaFields
      }
    }
  }
`;
