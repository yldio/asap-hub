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
    firstName
    lastName
    avatar {
      url
    }
    degrees
    country
    city
    region
    email
    alternativeEmail
    telephoneCountryCode
    telephoneNumber
    keywords
    biography
    questions
    fundingStreams
    blog
    linkedIn
    twitter
    github
    googleScholar
    orcid
    researchGate
    researcherId
    connections
    role
    onboarded
    activatedDate
    contributingCohortsCollection(limit: 100) {
      items {
        contributingCohort {
          sys {
            id
          }
          name
        }
        role
        studyLink
      }
    }
    linkedFrom {
      projectMembershipCollection(limit: 100) {
        items {
          user {
            sys {
              id
            }
          }
          role
          linkedFrom {
            projectsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                title
              }
            }
          }
        }
      }
      workingGroupMembershipCollection(limit: 100) {
        items {
          user {
            sys {
              id
            }
          }
          role
          linkedFrom {
            workingGroupsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                title
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
        ...UsersContent
      }
    }
  }
  ${usersContentQueryFragment}
`;
