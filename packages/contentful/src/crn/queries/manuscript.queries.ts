/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const manuscriptContentQueryFragment = gql`
  fragment ManuscriptsContent on Manuscripts {
    sys {
      id
    }
    title
    versionsCollection(limit: 20, order: sys_publishedAt_DESC) {
      items {
        sys {
          id
        }
        type
        lifecycle
      }
    }
  }
`;

export const FETCH_MANUSCRIPT_BY_ID = gql`
  query FetchManuscriptById($id: String!) {
    manuscripts(id: $id) {
      ...ManuscriptsContent
      teamsCollection(limit: 10) {
        items {
          sys {
            id
          }
        }
      }
    }
  }
  ${manuscriptContentQueryFragment}
`;
