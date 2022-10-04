import { gql } from 'graphql-tag';

export const FETCH_REMINDER_DATA = gql`
  query FetchReminderData(
    $userId: String!
    $researchOutputFilter: String!
    $eventFilter: String!
  ) {
    findUsersContent(id: $userId) {
      flatData {
        teams {
          id {
            id
          }
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
        videoRecordingUpdatedAt
        presentationUpdatedAt
      }
    }
  }
`;
