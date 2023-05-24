/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const eventsContentQueryFragment = gql`
  fragment EventsContentData on Events {
    sys {
      id
      publishedAt
      publishedVersion
    }
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
    notes {
      json
      links {
        entries {
          inline {
            sys {
              id
            }
            __typename
            ... on Media {
              url
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
            contentType
            width
            height
          }
        }
      }
    }
    notesUpdatedAt
    videoRecordingPermanentlyUnavailable
    videoRecording {
      json
      links {
        entries {
          inline {
            sys {
              id
            }
            __typename
            ... on Media {
              url
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
            contentType
            width
            height
          }
        }
      }
    }
    videoRecordingUpdatedAt
    presentationPermanentlyUnavailable
    presentation {
      json
      links {
        entries {
          inline {
            sys {
              id
            }
            __typename
            ... on Media {
              url
            }
          }
        }
        assets {
          block {
            sys {
              id
            }
            url
            description
            contentType
            width
            height
          }
        }
      }
    }
    presentationUpdatedAt
    meetingMaterialsPermanentlyUnavailable
    meetingMaterials
    calendar {
      googleCalendarId
      color
      name
    }
    thumbnail {
      url
    }
    speakersCollection(limit: 10) {
      items {
        title
        user {
          __typename
          ... on ExternalUsers {
            sys {
              id
            }
            name
            orcid
          }
          ... on Users {
            sys {
              id
            }
            firstName
            lastName
            onboarded
            avatar {
              url
            }
          }
        }
      }
    }
  }
`;

export const FETCH_EVENT_BY_ID = gql`
  query FetchEventById($id: String!) {
    events(id: $id) {
      ...EventsContentData
    }
  }
  ${eventsContentQueryFragment}
`;

export const FETCH_EVENTS = gql`
  query FetchEvents(
    $limit: Int
    $skip: Int
    $order: [EventsOrder]
    $where: EventsFilter
  ) {
    eventsCollection(limit: $limit, skip: $skip, order: $order, where: $where) {
      total
      items {
        ...EventsContentData
      }
    }
  }
  ${eventsContentQueryFragment}
`;

export const FETCH_EVENTS_BY_USER_ID = gql`
  query FetchEventsByUserId($id: String!, $limit: Int, $skip: Int, $where: EventsFilter) {
    users(id: $id) {
      linkedFrom {
        eventSpeakersCollection(limit: 1) {
          items {
            linkedFrom {
              eventsCollection(limit: $limit, skip: $skip, where: $where) {
                total
                items {
                  ...EventsContentData
                }
              }
            }
          }
        }
      }
    }
  }
  ${eventsContentQueryFragment}
`;

export const FETCH_EVENTS_BY_EXTERNAL_USER_ID = gql`
  query FetchEventsByExternalUserId($id: String!, $limit: Int, $skip: Int) {
    externalUsers(id: $id) {
      linkedFrom {
        eventSpeakersCollection(limit: 1) {
          items {
            linkedFrom {
              eventsCollection(limit: $limit, skip: $skip) {
                total
                items {
                  ...EventsContentData
                }
              }
            }
          }
        }
      }
    }
  }
  ${eventsContentQueryFragment}
`;
