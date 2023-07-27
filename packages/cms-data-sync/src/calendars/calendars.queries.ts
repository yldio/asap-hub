import { gql } from 'graphql-tag';

export const calendarsQuery = gql`
  query FetchCalendars {
    queryCalendarsContents(top: 100) {
      id
      status
      flatData {
        googleCalendarId
        name
        color
      }
    }
  }
`;
