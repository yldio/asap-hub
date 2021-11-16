import gql from 'graphql-tag';

export const FETCH_CALENDAR = gql`
  query FetchCalendar($id: String!) {
    findCalendarsContent(id: $id) {
      id
      created
      lastModified
      flatData {
        googleCalendarId
        name
        color
        syncToken
        resourceId
        expirationDate
      }
    }
  }
`;

export const FETCH_CALENDAR_VERSION = gql`
  query FetchCalendarVersion($id: String!) {
    findCalendarsContent(id: $id) {
      id
      created
      lastModified
      version
    }
  }
`;
