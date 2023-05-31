import gql from 'graphql-tag';
import { teamsContentQueryFragment } from './teams.queries';

export const groupContentQueryFragment = gql`
  fragment GroupsContent on Groups {
    id
    created
    lastModified
    version
    flatData {
      name
      active
      description
      tags
      tools {
        slack
        googleDrive
      }
      teams {
        ...TeamsContent
      }
      leaders {
        role
        inactiveSinceDate
        user {
          id
          created
          lastModified
          version
          flatData {
            avatar {
              id
            }
            email
            firstName
            lastModifiedDate
            lastName
            alumniSinceDate
            jobTitle
            institution
            teams {
              inactiveSinceDate
              role
              id {
                id
                flatData {
                  displayName
                  inactiveSince
                  proposal {
                    id
                  }
                }
              }
            }
          }
        }
      }
      calendars {
        id
        flatData {
          color
          googleCalendarId
          name
        }
      }
      thumbnail {
        id
      }
    }
  }
  ${teamsContentQueryFragment}
`;

export const FETCH_INTEREST_GROUPS = gql`
  query FetchGroups($top: Int, $skip: Int, $filter: String) {
    queryGroupsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: "data/name/iv"
    ) {
      total
      items {
        ...GroupsContent
      }
    }
  }
  ${groupContentQueryFragment}
`;

export const FETCH_INTEREST_GROUP = gql`
  query FetchGroup($id: String!) {
    findGroupsContent(id: $id) {
      ...GroupsContent
    }
  }
  ${groupContentQueryFragment}
`;
