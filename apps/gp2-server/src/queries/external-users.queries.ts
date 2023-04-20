import gql from 'graphql-tag';

export const externalUsersContentQueryFragment = gql`
  fragment ExternalUsersData on ExternalUsers {
    id
    flatData {
      name
      orcid
    }
  }
`;

export const FETCH_EXTERNAL_USER = gql`
  query FetchExternalUser($id: String!) {
    findExternalUsersContent(id: $id) {
      ...ExternalUsersData
    }
  }
  ${externalUsersContentQueryFragment}
`;

export const FETCH_EXTERNAL_USERS = gql`
  query FetchExternalUsers($top: Int, $skip: Int, $filter: String) {
    queryExternalUsersContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "data/name/iv"
    ) {
      total
      items {
        ...ExternalUsersData
      }
    }
  }
  ${externalUsersContentQueryFragment}
`;
