import { CARD_FRAGMENT, CARD_FRAGMENT_DEPS } from "../fragments/card";

/**
 * Hydrate query for a `countryCards` section. Each card is a shared `card`
 * entry (rendered with the `media-top` variant on a primary surface), so we
 * spread `...CardFields` and prepend its fragment dependencies (Image + Cta).
 */
export const COUNTRY_CARDS_BY_ID = /* GraphQL */ `
  ${CARD_FRAGMENT_DEPS.join("\n")}
  ${CARD_FRAGMENT}
  query CountryCardsById($id: String!, $preview: Boolean, $locale: String) {
    countryCards(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      sectionId
      cardsCollection(limit: 6) {
        items {
          ...CardFields
        }
      }
    }
  }
`;
