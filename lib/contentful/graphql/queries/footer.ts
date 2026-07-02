import { CARD_FRAGMENT, CARD_FRAGMENT_DEPS } from "../fragments/card";
// CARD_FRAGMENT_DEPS already includes ImageFields (used below for the logo).

/**
 * Hydrate query for a `footer` section. Reuses the shared entry types:
 * `image` (logo, via ...ImageFields), `socialLinks` (the icon row),
 * `stat` (charity-number blocks: label + value), `navigationItem` (legal
 * links: label + href) and `card` (partner logos + Fundraising Regulator
 * badge, each an image + titleHref, via ...CardFields). `address` and
 * `credit` are Rich Text (`{ json }`).
 */
export const FOOTER_BY_ID = /* GraphQL */ `
  ${CARD_FRAGMENT_DEPS.join("\n")}
  ${CARD_FRAGMENT}
  query FooterById($id: String!, $preview: Boolean, $locale: String) {
    footer(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      logo {
        ...ImageFields
      }
      socialLinks {
        facebookUrl
        twitterUrl
        linkedinUrl
        instagramUrl
        youtubeUrl
      }
      phone
      phoneHref
      email
      emailHref
      address {
        json
      }
      charityInfoCollection(limit: 6) {
        items {
          sys {
            id
          }
          value
          label
        }
      }
      legalLinksCollection(limit: 10) {
        items {
          sys {
            id
          }
          label
          href
        }
      }
      copyright
      credit {
        json
      }
      partnerLogosCollection(limit: 6) {
        items {
          ...CardFields
        }
      }
      badge {
        ...CardFields
      }
    }
  }
`;
