import { CTA_FRAGMENT } from "../fragments/cta";

export const DONATION_CTA_BY_ID = /* GraphQL */ `
  ${CTA_FRAGMENT}
  query DonationCtaById($id: String!, $preview: Boolean, $locale: String) {
    donationCta(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      sectionId
      heading
      subheading
      body {
        json
      }
      cta {
        ...CtaFields
      }
      photoCredit
      image {
        url
        title
        description
        width
        height
      }
    }
  }
`;
