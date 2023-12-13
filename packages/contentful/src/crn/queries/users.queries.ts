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
    alumniSinceDate
    alumniLocation
    biography
    connections
    createdDate
    degree
    email
    contactEmail
    dismissedGettingStarted
    firstName
    institution
    jobTitle
    lastName
    country
    city
    onboarded
    orcid
    orcidLastModifiedDate
    orcidLastSyncDate
    orcidWorks
    questions
    expertiseAndResourceTags
    expertiseAndResourceDescription
    github
    googleScholar
    linkedIn
    researcherId
    researchGate
    twitter
    website1
    website2
    role
    responsibilities
    researchInterests
    reachOut
    avatar {
      url
    }
    teamsCollection(limit: 10) {
      items {
        team {
          sys {
            id
          }
          displayName
          inactiveSince
          proposal {
            sys {
              id
            }
          }
          linkedFrom {
            interestGroupsCollection(limit: 10) {
              items {
                sys {
                  id
                }
                active
                name
              }
            }
          }
        }
        role
        inactiveSinceDate
      }
    }
    labsCollection(limit: 10) {
      items {
        sys {
          id
        }
        name
      }
    }
    linkedFrom {
      workingGroupMembersCollection(limit: 10) {
        items {
          inactiveSinceDate
          linkedFrom {
            workingGroupsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                title
                complete
              }
            }
          }
          user {
            lastName
          }
        }
      }
      workingGroupLeadersCollection(limit: 10) {
        items {
          role
          inactiveSinceDate
          linkedFrom {
            workingGroupsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                title
                complete
              }
            }
          }
          user {
            lastName
          }
        }
      }
      interestGroupLeadersCollection(limit: 10) {
        items {
          linkedFrom {
            interestGroupsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                active
                name
              }
            }
          }
        }
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
    avatar {
      url
    }
    city
    country
    createdDate
    degree
    email
    expertiseAndResourceTags
    firstName
    sys {
      id
    }
    institution
    jobTitle
    labsCollection(limit: 10) {
      items {
        sys {
          id
        }
        name
      }
    }
    lastName
    onboarded
    dismissedGettingStarted
    role
    teamsCollection(limit: 10) {
      items {
        team {
          sys {
            id
          }
          displayName
        }
        role
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
