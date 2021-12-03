import gql from 'graphql-tag';
import { FetchEventQuery } from '../gql/graphql';
import { groupContentQueryFragment } from './groups.queries';

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
        referencingGroupsContents {
          ...GroupsContent
        }
      }
      thumbnail {
        id
      }
    }
  }
  ${groupContentQueryFragment}
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

export const FETCH_GROUP_CALENDAR = gql`
  query FetchGroupCalendar($id: String!) {
    findGroupsContent(id: $id) {
      flatData {
        calendars {
          id
        }
      }
    }
  }
`;

export type GraphqlEvent = NonNullable<
  NonNullable<FetchEventQuery>['findEventsContent']
>;
