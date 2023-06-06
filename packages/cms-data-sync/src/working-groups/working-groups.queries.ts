/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const workingGroupsQuery = gql`
  query FetchWorkingGroups($take: Int, $skip: Int) {
    queryWorkingGroupsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        flatData {
          title
          description
          externalLink
          shortText
          complete
          deliverables {
            status
            description
          }
          leaders {
            workstreamRole
            role
            inactiveSinceDate
            user {
              id
            }
          }
          members {
            inactiveSinceDate
            user {
              id
            }
          }
          calendars {
            id
          }
        }
      }
    }
  }
`;
