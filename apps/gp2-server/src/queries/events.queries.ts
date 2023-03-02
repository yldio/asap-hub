import gql from 'graphql-tag';

export const eventContentFragment = gql`
  fragment EventContent on Events {
    id
    lastModified
    version
    created
    flatData {
      description
      endDate
      endDateTimeZone
      startDate
      startDateTimeZone
      meetingLink
      hideMeetingLink
      eventLink
      status
      tags
      title
      notesPermanentlyUnavailable
      notes
      videoRecordingPermanentlyUnavailable
      videoRecording
      presentationPermanentlyUnavailable
      presentation
      meetingMaterialsPermanentlyUnavailable
      meetingMaterials {
        url
        title
      }
      calendar {
        flatData {
          googleCalendarId
          color
          name
        }
      }
      thumbnail {
        id
      }
      speakers {
        user {
          __typename
          ... on Users {
            id
            flatData {
              firstName
              lastName
              onboarded
              avatar {
                id
              }
            }
          }
          ... on ExternalUsers {
            id
            flatData {
              name
              orcid
            }
          }
        }
        topic
      }
    }
  }
`;

export const FETCH_EVENTS = gql`
  query FetchEvents($top: Int, $skip: Int, $filter: String, $order: String) {
    queryEventsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: $order
    ) {
      total
      items {
        ...EventContent
      }
    }
  }
  ${eventContentFragment}
`;

export const FETCH_EVENT = gql`
  query FetchEvent($id: String!) {
    findEventsContent(id: $id) {
      ...EventContent
    }
  }
  ${eventContentFragment}
`;
