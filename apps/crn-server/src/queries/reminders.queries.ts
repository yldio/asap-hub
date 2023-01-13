import { gql } from 'graphql-tag';

export const FETCH_REMINDER_DATA = gql`
  query FetchReminderData(
    $userId: String!
    $researchOutputFilter: String!
    $eventFilter: String!
  ) {
    findUsersContent(id: $userId) {
      flatData {
        role
        teams {
          id {
            id
          }
          role
        }
      }
    }
    queryResearchOutputsContents(filter: $researchOutputFilter) {
      id
      flatData {
        addedDate
        documentType
        title
      }
      referencingTeamsContents {
        id
      }
    }
    queryEventsContents(filter: $eventFilter) {
      id
      flatData {
        startDate
        endDate
        title
        speakers {
          team {
            ... on Teams {
              id
              referencingUsersContents(
                filter: "data/teams/iv/role eq 'Project Manager'"
              ) {
                id
                flatData {
                  teams {
                    id {
                      id
                    }
                    role
                  }
                }
              }
            }
          }
          user {
            ... on Users {
              id
              flatData {
                role
                teams {
                  id {
                    id
                  }
                  role
                }
              }
            }
          }
        }
        videoRecordingUpdatedAt
        presentationUpdatedAt
        notesUpdatedAt
      }
    }
  }
`;
