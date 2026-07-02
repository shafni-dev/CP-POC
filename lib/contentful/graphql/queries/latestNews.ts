import { CARD_FRAGMENT, CARD_FRAGMENT_DEPS } from "../fragments/card";

/**
 * Hydrate query for a `latestNews` section. The eyebrow + heading drive the
 * shared centered `SectionHeader`; each card is a shared `card` entry rendered
 * with the `blog` variant, so we spread `...CardFields` and prepend its
 * fragment dependencies (Image + Cta).
 */
export const LATEST_NEWS_BY_ID = /* GraphQL */ `
  ${CARD_FRAGMENT_DEPS.join("\n")}
  ${CARD_FRAGMENT}
  query LatestNewsById($id: String!, $preview: Boolean, $locale: String) {
    latestNews(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      eyebrow
      heading
      sectionId
      cardsCollection(limit: 3) {
        items {
          ...CardFields
        }
      }
    }
  }
`;
