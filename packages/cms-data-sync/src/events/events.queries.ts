import { gql } from 'graphql-tag';

export const eventsQuery = gql`
  query FetchEvents($take: Int, $skip: Int) {
    queryEventsContentsWithTotal(top: $take, skip: $skip) {
      total
      items {
        id
        flatData {
          googleId
          description
          endDate
          endDateTimeZone
          startDate
          startDateTimeZone
          meetingLink
          hideMeetingLink
          eventLink
          status
          hidden
          tags
          title
          notesPermanentlyUnavailable
          notes
          notesUpdatedAt
          videoRecordingPermanentlyUnavailable
          videoRecording
          videoRecordingUpdatedAt
          presentationPermanentlyUnavailable
          presentation
          presentationUpdatedAt
          meetingMaterialsPermanentlyUnavailable
          meetingMaterials {
            url
            title
          }
          calendar {
            id
          }
          thumbnail {
            id
            fileName
            thumbnailUrl
            mimeType
            fileType
          }
          speakers {
            team {
              id
            }
            user {
              __typename
              ... on Users {
                id
              }
              ... on ExternalAuthors {
                id
              }
            }
          }
        }
      }
    }
  }
`;
