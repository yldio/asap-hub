import { gql } from 'graphql-tag';

export const FETCH_REMINDER_DATA = gql`
  query FetchReminderData(
    $userId: String!
    $researchOutputFilter: String!
    $researchOutputDraftFilter: String!
    $researchOutputInReviewFilter: String!
    $eventFilter: String!
  ) {
    findUsersContent(id: $userId) {
      referencingWorkingGroupsContents {
        id
      }
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
    draftResearchOutputs: queryResearchOutputsContents(
      filter: $researchOutputDraftFilter
    ) {
      id
      created
      status
      flatData {
        documentType
        title
        createdBy {
          id
          flatData {
            firstName
            lastName
          }
        }
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
    inReviewResearchOutputs: queryResearchOutputsContents(
      filter: $researchOutputInReviewFilter
    ) {
      id
      created
      status
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
        reviewRequestedBy {
          id
          flatData {
            firstName
            lastName
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
