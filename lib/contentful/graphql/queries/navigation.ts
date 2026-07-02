export const NAVIGATION_BY_ID = /* GraphQL */ `
  query NavigationById($id: String!, $preview: Boolean, $locale: String) {
    navigation(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      logo {
        url
        title
        width
        height
      }
      logoWidth
      logoHeight
      donateLabel
      donateHref
      socialLinks {
        facebookUrl
        twitterUrl
        linkedinUrl
        instagramUrl
        youtubeUrl
      }
      itemsCollection(limit: 15) {
        items {
          sys {
            id
          }
          label
          href
          childItemsCollection(limit: 25) {
            items {
              sys {
                id
              }
              label
              href
            }
          }
        }
      }
    }
  }
`;
