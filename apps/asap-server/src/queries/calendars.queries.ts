import gql from 'graphql-tag';

export const FETCH_CALENDAR = gql`
  query FetchCalendar($id: String!) {
    findCalendarsContent(id: $id) {
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
    }
  }
`;
