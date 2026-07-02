import { IMAGE_FRAGMENT } from "../fragments/image";
import { CTA_FRAGMENT } from "../fragments/cta";

/**
 * Hydrate query for an `impactStats` section. Pulls the parallax background
 * `image` (shared Image entry) and the "Latest Report" `cta` (shared Cta
 * entry) via their fragments, plus the stacked `stat` rows.
 */
export const IMPACT_STATS_BY_ID = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${CTA_FRAGMENT}
  query ImpactStatsById($id: String!, $preview: Boolean, $locale: String) {
    impactStats(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      sectionId
      heading
      image {
        ...ImageFields
      }
      statsCollection(limit: 12) {
        items {
          sys {
            id
          }
          value
          label
        }
      }
      cta {
        ...CtaFields
      }
    }
  }
`;
