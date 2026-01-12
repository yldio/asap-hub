/* istanbul ignore file */

import { gql } from 'graphql-tag';
import { manuscriptContentQueryFragment } from './manuscript.queries';

export const FETCH_TEAM_BY_ID = gql`
  query FetchTeamById($id: String!, $internalAPI: Boolean = true) {
    teams(id: $id) {
      sys {
        id
        publishedAt
      }
      displayName
      teamType
      teamDescription
      inactiveSince
      researchTheme {
        name
      }
      toolsCollection {
        items {
          name
          description
          url
        }
      }
      linkedFrom {
        manuscriptsCollection(limit: 20, order: sys_firstPublishedAt_DESC)
          @include(if: $internalAPI) {
          items {
            ...ManuscriptsContent
            teamsCollection(limit: 1) {
              items {
                sys {
                  id
                }
                linkedFrom {
                  projectMembershipCollection(limit: 1) {
                    items {
                      linkedFrom {
                        projectsCollection(limit: 1) {
                          items {
                            projectId
                            grantId
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
        teamMembershipCollection(limit: 100) {
          items {
            role
            inactiveSinceDate
            linkedFrom {
              usersCollection(limit: 1) {
                items {
                  sys {
                    id
                  }
                  onboarded
                  firstName
                  nickname
                  lastName
                  email
                  alumniSinceDate
                  avatar {
                    url
                  }
                  labsCollection(limit: 5) {
                    items {
                      sys {
                        id
                      }
                      name
                      labPi {
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
  }
  ${manuscriptContentQueryFragment}
`;

export const FETCH_TEAMS = gql`
  query FetchTeams(
    $limit: Int
    $skip: Int
    $order: [TeamsOrder]
    $where: TeamsFilter
  ) {
    teamsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {
      total
      items {
        sys {
          id
        }
        displayName
        inactiveSince
        teamType
        researchTheme {
          name
        }
        linkedFrom {
          teamMembershipCollection(limit: 100) {
            items {
              role
              linkedFrom {
                usersCollection(limit: 1) {
                  items {
                    sys {
                      id
                    }
                    onboarded
                    labsCollection(limit: 5) {
                      items {
                        sys {
                          id
                        }
                        labPi {
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
          projectMembershipCollection(limit: 1) {
            items {
              linkedFrom {
                projectsCollection(limit: 1) {
                  items {
                    sys {
                      id
                    }
                    title
                    projectType
                    resourceType {
                      name
                    }
                    researchTagsCollection(limit: 20) {
                      items {
                        sys {
                          id
                        }
                        name
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

export const FETCH_PUBLIC_TEAMS = gql`
  query FetchPublicTeams(
    $limit: Int
    $skip: Int
    $order: [TeamsOrder]
    $where: TeamsFilter
  ) {
    teamsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {
      total
      items {
        sys {
          id
        }
        displayName
        inactiveSince
        researchTheme {
          name
        }
        linkedFrom {
          teamMembershipCollection(limit: 100) {
            items {
              role
              inactiveSinceDate
              linkedFrom {
                usersCollection(limit: 1) {
                  items {
                    sys {
                      id
                    }
                    firstName
                    nickname
                    lastName
                    alumniSinceDate
                    avatar {
                      url
                    }
                    onboarded
                  }
                }
              }
            }
          }
          interestGroupsTeamsCollection(limit: 100) {
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
          projectMembershipCollection(limit: 1) {
            items {
              linkedFrom {
                projectsCollection(limit: 1) {
                  items {
                    title
                    originalGrant
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

export const FETCH_PUBLIC_TEAM_BY_ID = gql`
  query FetchPublicTeamById($id: String!) {
    teams(id: $id) {
      sys {
        id
        publishedAt
      }
      displayName
      inactiveSince
      researchTheme {
        name
      }
      linkedFrom {
        teamMembershipCollection(limit: 100) {
          items {
            role
            inactiveSinceDate
            linkedFrom {
              usersCollection(limit: 1) {
                items {
                  sys {
                    id
                  }
                  firstName
                  nickname
                  lastName
                  alumniSinceDate
                  avatar {
                    url
                  }
                  onboarded
                }
              }
            }
          }
        }
        projectMembershipCollection(limit: 1) {
          items {
            linkedFrom {
              projectsCollection(limit: 1) {
                items {
                  title
                  originalGrant
                  researchTagsCollection(limit: 20) {
                    items {
                      sys {
                        id
                      }
                      name
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

export const FETCH_PROJECT_BY_TEAM_ID = gql`
  query FetchTeamProjectById($id: String!) {
    teams(id: $id) {
      linkedFrom {
        projectMembershipCollection(limit: 1) {
          items {
            linkedFrom {
              projectsCollection(limit: 1) {
                items {
                  sys {
                    id
                  }
                  title
                  projectId
                  grantId
                  originalGrant
                  status
                  projectType
                  contactEmail
                  proposal {
                    sys {
                      id
                    }
                  }
                  supplementGrant {
                    title
                    description
                    startDate
                    endDate
                    proposal {
                      sys {
                        id
                      }
                    }
                  }
                  resourceType {
                    name
                  }
                  researchTagsCollection(limit: 20) {
                    items {
                      sys {
                        id
                      }
                      name
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

export const FETCH_TEAM_ID_BY_PROJECT_ID = gql`
  query FetchTeamIdByProjectId($projectId: String!) {
    projects(id: $projectId) {
      membersCollection(limit: 1) {
        items {
          projectMember {
            ... on Teams {
              __typename
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
