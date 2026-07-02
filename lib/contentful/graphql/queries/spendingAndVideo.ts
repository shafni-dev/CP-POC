export const SPENDING_AND_VIDEO_BY_ID = /* GraphQL */ `
  query SpendingAndVideoById($id: String!, $preview: Boolean, $locale: String) {
    spendingAndVideo(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      sectionId
      heading
      body {
        json
      }
      chartImage {
        url
        width
        height
        title
      }
      chartAlt
      legendCollection(limit: 10) {
        items {
          sys {
            id
          }
          label
          percentage
          color
        }
      }
      video {
        sys {
          id
        }
        youtubeId
        videoTitle
        caption
      }
    }
  }
`;
