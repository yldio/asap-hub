import gql from 'graphql-tag';

export const externalUsersContentQueryFragment = gql`
  fragment ExternalUsersContent on ExternalUsers {
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
      ...ExternalUsersContent
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
        ...ExternalUsersContent
      }
    }
  }
  ${externalUsersContentQueryFragment}
`;
