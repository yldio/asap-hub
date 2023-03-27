/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const externalAuthorsContentQueryFragment = gql`
  fragment ExternalAuthorsContent on ExternalAuthors {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    name
    orcid
  }
`;

export const FETCH_EXTERNAL_AUTHOR_BY_ID = gql`
  query FetchExternalAuthorById($id: String!) {
    externalAuthors(id: $id) {
      ...ExternalAuthorsContent
    }
  }
  ${externalAuthorsContentQueryFragment}
`;

export const FETCH_EXTERNAL_AUTHORS = gql`
  query FetchExternalAuthors(
    $limit: Int
    $skip: Int
    $order: [ExternalAuthorsOrder]
  ) {
    externalAuthorsCollection(limit: $limit, skip: $skip, order: $order) {
      total
      items {
        ...ExternalAuthorsContent
      }
    }
  }
  ${externalAuthorsContentQueryFragment}
`;
