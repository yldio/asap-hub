import gql from 'graphql-tag';

export const FETCH_DASHBOARD = gql`
  query FetchDashboard {
    queryDashboardContents {
      flatData {
        news {
          id
          created
          flatData {
            title
            shortText
            text
            type
            thumbnail {
              id
            }
            link
            linkText
          }
        }
        pages {
          id
          created
          flatData {
            path
            title
            shortText
            text
            link
            linkText
          }
        }
      }
    }
  }
`;
