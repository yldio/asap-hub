/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const manuscriptContentQueryFragment = gql`
  fragment ManuscriptsContent on Manuscripts {
    sys {
      id
    }
    title
  }
`;

export const FETCH_MANUSCRIPT_BY_ID = gql`
  query FetchManuscriptById($id: String!) {
    manuscripts(id: $id) {
      ...ManuscriptsContent
    }
  }
  ${manuscriptContentQueryFragment}
`;
