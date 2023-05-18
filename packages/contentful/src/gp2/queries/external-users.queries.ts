/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const externalUsersContentQueryFragment = gql`
  fragment ExternalUsersContentData on ExternalUsers {
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

export const FETCH_EXTERNAL_USERS = gql`
  query FetchExternalUsers(
    $limit: Int
    $skip: Int
    $order: [ExternalUsersOrder]
    $where: ExternalUsersFilter
  ) {
    externalUsersCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
    ) {
      total
      items {
        ...ExternalUsersContentData
      }
    }
  }
  ${externalUsersContentQueryFragment}
`;
