import { CARD_FRAGMENT, CARD_FRAGMENT_DEPS } from "../fragments/card";

/**
 * Hydrate query for an `exploreSlider` section. Each card is a shared `card`
 * entry (rendered with the `linked` variant), so we spread `...CardFields`
 * and prepend its fragment dependencies (Image + Cta).
 */
export const EXPLORE_SLIDER_BY_ID = /* GraphQL */ `
  ${CARD_FRAGMENT_DEPS.join("\n")}
  ${CARD_FRAGMENT}
  query ExploreSliderById($id: String!, $preview: Boolean, $locale: String) {
    exploreSlider(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      sectionId
      eyebrow
      heading
      cardsCollection(limit: 12) {
        items {
          ...CardFields
        }
      }
    }
  }
`;
