import { gql } from 'graphql-tag';

export const usersContentQueryFragment = gql`
  fragment UsersContent on Users {
    id
    created
    lastModified
    version
    flatData {
      avatar {
        id
      }
      degree
      email
      firstName
      lastName
      region
      role
      country
      city
      positions {
        role
        department
        institution
      }
    }
  }
`;

export const FETCH_USER = gql`
  query FetchUser($id: String!) {
    findUsersContent(id: $id) {
      ...UsersContent
    }
  }
  ${usersContentQueryFragment}
`;

export const FETCH_USERS = gql`
  query FetchUsers($top: Int, $skip: Int, $filter: String) {
    queryUsersContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "data/firstName/iv,data/lastName/iv"
    ) {
      total
      items {
        ...UsersContent
      }
    }
  }
  ${usersContentQueryFragment}
`;
