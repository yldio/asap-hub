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
      teamId
      grantId
      inactiveSince
      projectSummary
      projectTitle
      proposal {
        sys {
          id
        }
      }
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
      researchTagsCollection(limit: 20) {
        items {
          sys {
            id
          }
          name
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
                teamId
                grantId
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
        projectTitle
        researchTagsCollection(limit: 20) {
          items {
            sys {
              id
            }
            name
          }
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
        projectTitle
        projectSummary
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
        }
      }
    }
  }
`;
