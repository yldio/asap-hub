/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const eventsContentQueryFragment = gql`
  fragment EventsContent on Events {
    sys {
      id
      publishedAt
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
        team {
          sys {
            id
          }
          displayName
          inactiveSince
        }
        user {
          __typename
          ... on ExternalAuthors {
            name
            orcid
          }
          ... on Users {
            sys {
              id
            }
            alumniSinceDate
            alumniLocation
            firstName
            lastName
            onboarded
            teamsCollection(limit: 5) {
              items {
                sys {
                  id
                }
                role
              }
            }
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
      ...EventsContent
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
        ...EventsContent
      }
    }
  }
  ${eventsContentQueryFragment}
`;

export const FETCH_EVENTS_BY_USER_ID = gql`
  query FetchEventsByUserId($id: String!, $limit: Int, $skip: Int) {
    users(id: $id) {
      linkedFrom {
        eventSpeakersCollection(limit: 1) {
          items {
            linkedFrom {
              eventsCollection(limit: $limit, skip: $skip) {
                total
                items {
                  ...EventsContent
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

export const FETCH_EVENTS_BY_EXTERNAL_AUTHOR_ID = gql`
  query FetchEventsByExternalAuthorId($id: String!, $limit: Int, $skip: Int) {
    externalAuthors(id: $id) {
      linkedFrom {
        eventSpeakersCollection(limit: 1) {
          items {
            linkedFrom {
              eventsCollection(limit: $limit, skip: $skip) {
                total
                items {
                  ...EventsContent
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

export const FETCH_EVENTS_BY_TEAM_ID = gql`
  query FetchEventsByTeamId($id: String!, $limit: Int, $skip: Int) {
    teams(id: $id) {
      linkedFrom {
        eventSpeakersCollection(limit: 1) {
          items {
            linkedFrom {
              eventsCollection(limit: $limit, skip: $skip) {
                total
                items {
                  ...EventsContent
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
