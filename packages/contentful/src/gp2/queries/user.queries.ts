/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const usersContentQueryFragment = gql`
  fragment UsersContentData on Users {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    activatedDate
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
    positions
    activatedDate
    contributingCohortsCollection(limit: 10) {
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
      projectMembershipCollection(limit: 10) {
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
                status
                membersCollection(limit: 25) {
                  items {
                    role
                    user {
                      sys {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      workingGroupMembershipCollection(limit: 10) {
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
                membersCollection(limit: 25) {
                  items {
                    role
                    user {
                      sys {
                        id
                      }
                    }
                  }
                }
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
      ...UsersContentData
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
        ...UsersContentData
      }
    }
  }
  ${usersContentQueryFragment}
`;

export const FETCH_USERS_BY_PROJECT_ID = gql`
  query FetchUsersByProjectId($id: [String]!) {
    projectsCollection(limit: 20, where: { sys: { id_in: $id } }) {
      total
      items {
        membersCollection(limit: 25) {
          total
          items {
            user {
              sys {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const FETCH_USERS_BY_WORKING_GROUP_ID = gql`
  query FetchUsersByWorkingGroupId($id: [String]!) {
    workingGroupsCollection(limit: 20, where: { sys: { id_in: $id } }) {
      total
      items {
        membersCollection(limit: 25) {
          total
          items {
            user {
              sys {
                id
              }
            }
          }
        }
      }
    }
  }
`;
