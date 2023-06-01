import { gql } from 'graphql-tag';

export const interestGroupsQuery = gql`
  query FetchGroups($take: Int, $skip: Int) {
    queryGroupsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        created
        lastModified
        version
        flatData {
          name
          active
          tags
          description
          thumbnail {
            id
            fileName
            mimeType
            fileType
          }
          tools {
            slack
            googleDrive
          }
          calendars {
            id
          }
          teams {
            id
          }
          leaders {
            user {
              id
            }
            role
            inactiveSinceDate
          }
        }
      }
    }
  }
`;
