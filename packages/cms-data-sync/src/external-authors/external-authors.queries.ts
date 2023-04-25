import { gql } from 'graphql-tag';

export const externalAuthorsQuery = gql`
  query FetchExternalAuthors($take: Int, $skip: Int) {
    queryExternalAuthorsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        flatData {
          name
          orcid
        }
      }
    }
  }
`;
