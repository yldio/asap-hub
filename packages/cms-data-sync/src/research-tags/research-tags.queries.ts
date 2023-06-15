import { gql } from 'graphql-tag';

export const researchTagsQuery = gql`
  query FetchResearchTags($take: Int, $skip: Int) {
    queryResearchTagsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        created
        lastModified
        flatData {
          name
          category
          types
          entities
        }
      }
    }
  }
`;
