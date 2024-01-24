/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_REMINDERS = gql`
  query FetchReminders($outputFilter: OutputsFilter, $userId: String!) {
    users(id: $userId) {
      linkedFrom {
        workingGroupMembershipCollection(limit: 15) {
          items {
            linkedFrom {
              workingGroupsCollection(limit: 1) {
                items {
                  sys {
                    id
                  }
                }
              }
            }
          }
        }
        projectMembershipCollection(limit: 15) {
          items {
            linkedFrom {
              projectsCollection(limit: 1) {
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
    outputsCollection(where: $outputFilter) {
      items {
        sys {
          id
        }
        title
        documentType
        addedDate
        createdBy {
          firstName
          lastName
        }
        relatedEntitiesCollection(limit: 1) {
          items {
            __typename
            ... on Projects {
              sys {
                id
              }
              title
            }
            ... on WorkingGroups {
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
`;
