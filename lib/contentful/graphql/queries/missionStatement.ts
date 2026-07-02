export const MISSION_STATEMENT_BY_ID = /* GraphQL */ `
  query MissionStatementById($id: String!, $preview: Boolean, $locale: String) {
    missionStatement(id: $id, preview: $preview, locale: $locale) {
      sys {
        id
      }
      frontEndComponent
      eyebrow
      heading
      body {
        json
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
    }
  }
`;
