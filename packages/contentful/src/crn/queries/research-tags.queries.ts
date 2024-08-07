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

export const FETCH_RESEARCH_TAGS_BY_ID = gql`
  query FetchResearchTagsById($id: String!) {
    researchTags(id: $id) {
      ...ResearchTagsContent
    }
  }
  ${researchTagsContentQueryFragment}
`;
