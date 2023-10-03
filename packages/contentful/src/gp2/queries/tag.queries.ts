/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const tagsContentQueryFragment = gql`
  fragment TagsContentData on Tags {
    sys {
      id
    }
    name
  }
`;

export const FETCH_TAGS = gql`
  query FetchTags($limit: Int, $order: [TagsOrder]) {
    tagsCollection(limit: $limit, order: $order) {
      total
      items {
        ...TagsContentData
      }
    }
  }
  ${tagsContentQueryFragment}
`;
