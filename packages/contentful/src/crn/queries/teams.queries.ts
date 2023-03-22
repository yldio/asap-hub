/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const teamsContentQueryFragment = gql`
  fragment TeamsContent on Teams {
    sys {
      id
      firstPublishedAt
      publishedAt
      publishedVersion
    }
    displayName
    applicationNumber
    inactiveSince
    projectSummary
    projectTitle
    expertiseAndResourceTags
    toolsCollection {
      items {
        name
        description
        url
      }
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
`;

export const FETCH_TEAM_BY_ID = gql`
  query FetchTeamById($id: String!) {
    teams(id: $id) {
      ...TeamsContent
    }
  }
  ${teamsContentQueryFragment}
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
        ...TeamsContent
      }
    }
  }
  ${teamsContentQueryFragment}
`;
