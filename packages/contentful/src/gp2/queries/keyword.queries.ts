/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const keywordsContentQueryFragment = gql`
  fragment KeywordsContentData on Keywords {
    sys {
      id
    }
    name
  }
`;

export const FETCH_KEYWORDS = gql`
  query FetchKeywords($limit: Int, $order: [KeywordsOrder]) {
    keywordsCollection(limit: $limit, order: $order) {
      total
      items {
        ...KeywordsContentData
      }
    }
  }
  ${keywordsContentQueryFragment}
`;
