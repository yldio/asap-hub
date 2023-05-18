import { gql } from 'graphql-tag';

export const FETCH_REMINDER_DATA = gql`
  query FetchReminderData(
    $userId: String!
    $researchOutputFilter: String!
    $researchOutputDraftFilter: String!
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
      created
      status
      flatData {
        addedDate
        documentType
        title
        teams {
          id
        }
        workingGroups {
          id
        }
      }
    }
    drafts: queryResearchOutputsContents(filter: $researchOutputDraftFilter) {
      id
      created
      status
      createdByUser {
        id
      }
      referencesUsersContents {
        id 
        flatData {
          firstName
          lastName
        }
      }
      flatData {
        documentType
        title
        teams {
          id
          flatData {
            displayName
          }
        }
        workingGroups {
          id
          flatData {
            title
          }
        }
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
