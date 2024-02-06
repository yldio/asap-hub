/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const usersContentQueryFragment = gql`
  fragment UsersContent on Users {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    lastUpdated
    createdDate
    firstName
    middleName
    lastName
    nickname
    institution
    jobTitle
    expertiseAndResourceTags
    expertiseAndResourceDescription
    researchTagsCollection(limit: 20) {
      items {
        sys {
          id
        }
        name
      }
    }
  }
`;

export const FETCH_USER_BY_ID = gql`
  query FetchUserById($id: String!) {
    users(id: $id) {
      ...UsersContent
    }
  }
  ${usersContentQueryFragment}
`;

export const userListItemContentQueryFragment = gql`
  fragment UserListItemContent on Users {
    alumniSinceDate
    createdDate
    degree
    email
    expertiseAndResourceTags
    firstName
    sys {
      id
    }
    institution
    lastName
    middleName
    nickname
    researchTagsCollection(limit: 20) {
      items {
        sys {
          id
        }
        name
      }
    }
  }
`;

export const FETCH_USERS = gql`
  query FetchUsers(
    $limit: Int
    $skip: Int
    $order: [UsersOrder]
    $where: UsersFilter
  ) {
    usersCollection(limit: $limit, skip: $skip, order: $order, where: $where) {
      total
      items {
        ...UserListItemContent
      }
    }
  }
  ${userListItemContentQueryFragment}
`;

export const FETCH_USERS_BY_TEAM_ID = gql`
  query FetchUsersByTeamId($id: String!, $limit: Int, $skip: Int) {
    teamMembershipCollection(
      limit: $limit
      skip: $skip
      where: { team: { sys: { id: $id } } }
    ) {
      total
      items {
        linkedFrom {
          usersCollection(limit: 1) {
            items {
              ...UserListItemContent
            }
          }
        }
      }
    }
  }
  ${userListItemContentQueryFragment}
`;

export const FETCH_USERS_BY_LAB_ID = gql`
  query FetchUsersByLabId($id: String!, $limit: Int, $skip: Int) {
    labs(id: $id) {
      linkedFrom {
        usersCollection(limit: $limit, skip: $skip) {
          total
          items {
            ...UserListItemContent
          }
        }
      }
    }
  }
  ${userListItemContentQueryFragment}
`;
