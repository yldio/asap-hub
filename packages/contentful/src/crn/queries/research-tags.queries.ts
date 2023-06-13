/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const researchTagsContentQueryFragment = gql`
  fragment ResearchTagsContent on ResearchTags {
    sys {
      id
    }
    name
    category
    types
    entities
  }
`;

export const FETCH_RESEARCH_TAGS = gql`
  query FetchResearchTags(
    $limit: Int
    $skip: Int
    $order: [ResearchTagsOrder]
    $where: ResearchTagsFilter
  ) {
    researchTagsCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
    ) {
      total
      items {
        ...ResearchTagsContent
      }
    }
  }
  ${researchTagsContentQueryFragment}
`;
