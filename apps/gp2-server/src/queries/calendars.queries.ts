import { gql } from 'graphql-tag';

export const calendarContentQueryFragment = gql`
  fragment CalendarsData on Calendars {
    id
    created
    lastModified
    version
    flatData {
      googleCalendarId
      name
      color
      syncToken
      resourceId
      expirationDate
    }
    referencingProjectsContents {
      id
      flatData {
        title
      }
    }
    referencingWorkingGroupsContents {
      id
      flatData {
        title
      }
    }
  }
`;

export const FETCH_CALENDAR = gql`
  query FetchCalendar($id: String!) {
    findCalendarsContent(id: $id) {
      ...CalendarsData
    }
  }
  ${calendarContentQueryFragment}
`;

export const FETCH_CALENDARS = gql`
  query FetchCalendars($top: Int, $skip: Int, $filter: String, $order: String) {
    queryCalendarsContentsWithTotal(
      top: $top
      skip: $skip
      filter: $filter
      orderby: $order
    ) {
      total
      items {
        ...CalendarsData
      }
    }
  }
  ${calendarContentQueryFragment}
`;
