import { gql } from 'graphql-tag';

export const labsQuery = gql`
  query FetchLabs($take: Int, $skip: Int) {
    queryLabsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        created
        lastModified
        version
        flatData {
          name
        }
      }
    }
  }
`;
