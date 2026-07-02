export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    sys {
      id
    }
    alt
    loading
    asset {
      url
      title
      description
      width
      height
      contentType
    }
  }
`;
