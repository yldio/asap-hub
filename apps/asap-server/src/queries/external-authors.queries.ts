import { gql } from 'graphql-tag';

export const externalAuthorsContentQueryFragment = gql`
  fragment ExternalAuthorsContent on ExternalAuthors {
    id
    created
    lastModified
    version
    flatData {
      name
      orcid
    }
  }
`;

export const FETCH_EXTERNAL_AUTHOR = gql`
  query FetchExternalAuthor($id: String!) {
    findExternalAuthorsContent(id: $id) {
      ...ExternalAuthorsContent
    }
  }
  ${externalAuthorsContentQueryFragment}
`;

export const FETCH_EXTERNAL_AUTHORS = gql`
  query FetchExternalAuthors($top: Int, $skip: Int) {
    queryExternalAuthorsContentsWithTotal(
      top: $top
      skip: $skip
      orderby: "data/name/iv"
    ) {
      total
      items {
        ...ExternalAuthorsContent
      }
    }
  }
  ${externalAuthorsContentQueryFragment}
`;
