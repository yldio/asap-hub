import gql from 'graphql-tag';

export const researchTagContentQueryFragment = gql`
  fragment ResearchTagContent on ResearchTags {
    id
    flatData {
      name
      category
      types
      entities
    }
  }
`;

export const FETCH_RESEARCH_TAGS = gql`
  query FetchResearchTags($top: Int, $skip: Int, $filter: String) {
    queryResearchTagsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
    ) {
      total
      items {
        ...ResearchTagContent
      }
    }
  }
  ${researchTagContentQueryFragment}
`;
