import { CARD_FRAGMENT, CARD_FRAGMENT_DEPS } from "../fragments/card";

/**
 * Hydrate query for a `heroSlider` section. Each slide is a shared `card`
 * entry (rendered with the `media-left` variant), so we spread `...CardFields`
 * and prepend its fragment dependencies (Image + Cta).
 */
export const HERO_SLIDER_BY_ID = /* GraphQL */ `
  ${CARD_FRAGMENT_DEPS.join("\n")}
  ${CARD_FRAGMENT}
  query HeroSliderById($id: String!, $preview: Boolean, $locale: String) {
    heroSlider(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      sectionId
      slidesCollection(limit: 12) {
        items {
          ...CardFields
        }
      }
    }
  }
`;
