import gql from 'graphql-tag';

export const calendarContentQueryFragment = gql`
  fragment CalendarsContent on Calendars {
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
    referencingGroupsContents {
      flatData {
        active
      }
    }
  }
`;

export const FETCH_CALENDAR = gql`
  query FetchCalendar($id: String!) {
    findCalendarsContent(id: $id) {
      ...CalendarsContent
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
        ...CalendarsContent
      }
    }
  }
  ${calendarContentQueryFragment}
`;
