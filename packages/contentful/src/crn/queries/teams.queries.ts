/* istanbul ignore file */

import { gql } from 'graphql-tag';
import { manuscriptContentQueryFragment } from './manuscript.queries';

export const FETCH_TEAM_BY_ID = gql`
  query FetchTeamById($id: String!) {
    teams(id: $id) {
      sys {
        id
        publishedAt
      }
      displayName
      inactiveSince
      projectSummary
      projectTitle
      proposal {
        sys {
          id
        }
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
      linkedFrom {
        manuscriptsCollection(limit: 20, order: sys_firstPublishedAt_DESC) {
          items {
            ...ManuscriptsContent
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
