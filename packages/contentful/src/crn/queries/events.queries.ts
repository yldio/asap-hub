/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const eventsContentQueryFragment = gql`
  fragment EventsContent on Events {
    sys {
      id
      publishedVersion
    }
    lastUpdated
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
    linkedFrom {
      researchOutputsCollection(limit: 10) {
        items {
          sys {
            id
          }
          title
          type
          documentType
          workingGroup @include(if: $singleEvent) {
            sys {
              id
            }
            title
          }
          teamsCollection(limit: 10) @include(if: $singleEvent) {
            items {
              sys {
                id
              }
              displayName
            }
          }
        }
      }
    }
    calendar {
      googleCalendarId
      color
      name
      linkedFrom {
        workingGroupsCollection(limit: 1) {
          items {
            sys {
              id
            }
            title
          }
        }
        interestGroupsCollection(limit: 1) {
          items {
            sys {
              id
            }
            name
            active
            slack
            googleDrive
          }
        }
      }
    }
    thumbnail {
      url
    }
    speakersCollection(limit: 25) {
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
                team {
                  sys {
                    id
                  }
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
  query FetchEventById($id: String!, $singleEvent: Boolean = true) {
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
    $singleEvent: Boolean = false
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
  query FetchEventsByUserId(
    $id: String!
    $limit: Int
    $skip: Int
    $singleEvent: Boolean = false
  ) {
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
  query FetchEventsByExternalAuthorId(
    $id: String!
    $limit: Int
    $skip: Int
    $singleEvent: Boolean = false
  ) {
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
  query FetchEventsByTeamId(
    $id: String!
    $limit: Int
    $skip: Int
    $singleEvent: Boolean = false
  ) {
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

export const FETCH_WORKING_GROUP_CALENDAR = gql`
  query FetchWorkingGroupCalendar($id: String!) {
    workingGroups(id: $id) {
      calendars {
        sys {
          id
        }
      }
    }
  }
`;

export const FETCH_INTEREST_GROUP_CALENDAR = gql`
  query FetchInterestGroupCalendar($id: String!) {
    interestGroups(id: $id) {
      calendar {
        sys {
          id
        }
      }
    }
  }
`;
