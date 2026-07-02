import { IMAGE_FRAGMENT } from "./image";
import { CTA_FRAGMENT } from "./cta";

export const CARD_FRAGMENT = /* GraphQL */ `
  fragment CardFields on Card {
    sys {
      id
    }
    frontEndComponent
    eyebrow
    title
    titleHref
    meta
    body {
      json
    }
    image {
      ...ImageFields
    }
    cta {
      ...CtaFields
    }
  }
`;

/**
 * `CARD_FRAGMENT` references `ImageFields` and `CtaFields`, so any query that
 * spreads `...CardFields` must also include these fragment definitions.
 */
export const CARD_FRAGMENT_DEPS = [IMAGE_FRAGMENT, CTA_FRAGMENT];
