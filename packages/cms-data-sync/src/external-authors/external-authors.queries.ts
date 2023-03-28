import { gql } from 'graphql-tag';

export const externalAuthorsQuery = gql`
  query FetchExternalAuthors {
    queryExternalAuthorsContents(top: 100) {
      id
      flatData {
        name
        orcid
      }
    }
  }
`;
