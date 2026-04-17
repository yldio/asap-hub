/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const projectsContentQueryFragment = gql`
  fragment ProjectsContentData on Projects {
    sys {
      id
      firstPublishedAt
      publishedAt
    }
    title
    projectId
    grantId
    originalGrant
    projectType
    status
    startDate
    endDate
    applicationNumber
    contactEmail
    googleDriveLink
    proposal {
      sys {
        id
      }
    }
    originalGrantAimsCollection(limit: 20) {
      items {
        sys {
          id
        }
        description
      }
    }
    supplementGrant {
      sys {
        id
      }
      title
      description
      startDate
      endDate
      proposal {
        sys {
          id
        }
      }
      aimsCollection(limit: 20) {
        items {
          sys {
            id
          }
          description
        }
      }
    }
    resourceType {
      sys {
        id
      }
      name
    }
    researchTagsCollection(limit: 20) {
      total
      items {
        sys {
          id
        }
        name
        category
        types
      }
    }
    toolsCollection {
      items {
        sys {
          id
        }
        name
        description
        url
      }
    }
    membersCollection(limit: 100) {
      total
      items {
        sys {
          id
        }
        role
        projectMember {
          ... on Users {
            __typename
            sys {
              id
            }
            firstName
            nickname
            lastName
            email
            onboarded
            alumniSinceDate
            avatar {
              url
            }
            linkedFrom {
              manuscriptsCollection(
                limit: 50
                order: sys_firstPublishedAt_DESC
              ) {
                items {
                  sys {
                    id
                  }
                  status
                  teamsCollection(limit: 1) {
                    items {
                      sys {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
          ... on Teams {
            __typename
            sys {
              id
            }
            displayName
            inactiveSince
            researchTheme {
              name
            }
            teamDescription
            linkedFrom {
              manuscriptsCollection(
                limit: 20
                order: sys_firstPublishedAt_DESC
              ) {
                items {
                  sys {
                    id
                  }
                  status
                  teamsCollection(limit: 1) {
                    items {
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

export const projectsMinimalContentQueryFragment = gql`
  fragment ProjectsMinimalContentData on Projects {
    sys {
      id
      firstPublishedAt
      publishedAt
    }
    title
    projectId
    grantId
    originalGrant
    projectType
    status
    startDate
    endDate
    applicationNumber
    contactEmail
    googleDriveLink
    supplementGrant {
      description
    }
    resourceType {
      sys {
        id
      }
      name
    }
    researchTagsCollection(limit: 20) {
      total
      items {
        sys {
          id
        }
        name
        category
        types
      }
    }
    toolsCollection {
      items {
        sys {
          id
        }
        name
        description
        url
      }
    }
    membersCollection(limit: 100) {
      total
      items {
        sys {
          id
        }
        role
        projectMember {
          ... on Users {
            __typename
            sys {
              id
            }
            firstName
            nickname
            lastName
            email
            onboarded
            alumniSinceDate
            avatar {
              url
            }
          }
          ... on Teams {
            __typename
            sys {
              id
            }
            displayName
            inactiveSince
            researchTheme {
              name
            }
            teamDescription
          }
        }
      }
    }
  }
`;

export const FETCH_PROJECTS = gql`
  ${projectsMinimalContentQueryFragment}
  query FetchProjects(
    $limit: Int
    $skip: Int
    $order: [ProjectsOrder]
    $where: ProjectsFilter
  ) {
    projectsCollection(
      limit: $limit
      skip: $skip
      order: $order
      where: $where
    ) {
      total
      items {
        ...ProjectsMinimalContentData
      }
    }
  }
`;

export const FETCH_PROJECT_BY_ID = gql`
  ${projectsContentQueryFragment}
  query FetchProjectById($id: String!) {
    projects(id: $id) {
      ...ProjectsContentData
    }
  }
`;

// Fetches projects associated with a team via reverse lookup
// Teams -> linkedFrom.projectMembershipCollection -> linkedFrom.projectsCollection
export const FETCH_PROJECTS_BY_TEAM_ID = gql`
  ${projectsMinimalContentQueryFragment}
  query FetchProjectsByTeamId($teamId: String!, $limit: Int) {
    teams(id: $teamId) {
      linkedFrom {
        projectMembershipCollection(limit: $limit) {
          total
          items {
            linkedFrom {
              projectsCollection(limit: 1) {
                items {
                  ...ProjectsMinimalContentData
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Fetches projects associated with a user via reverse lookup
// Users -> linkedFrom.projectMembershipCollection -> linkedFrom.projectsCollection
export const FETCH_PROJECTS_BY_USER_ID = gql`
  ${projectsMinimalContentQueryFragment}
  query FetchProjectsByUserId($userId: String!, $limit: Int) {
    users(id: $userId) {
      linkedFrom {
        projectMembershipCollection(limit: $limit) {
          total
          items {
            linkedFrom {
              projectsCollection(limit: 1) {
                items {
                  ...ProjectsMinimalContentData
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Fetches projects that contain a specific project membership via reverse lookup
// ProjectMembership -> linkedFrom.projectsCollection
export const FETCH_PROJECTS_BY_MEMBERSHIP_ID = gql`
  ${projectsMinimalContentQueryFragment}
  query FetchProjectsByMembershipId($membershipId: String!, $limit: Int) {
    projectMembership(id: $membershipId) {
      sys {
        id
      }
      linkedFrom {
        projectsCollection(limit: $limit) {
          total
          items {
            ...ProjectsMinimalContentData
          }
        }
      }
    }
  }
`;
