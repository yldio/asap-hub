import gql from 'graphql-tag';

export const FETCH_DASHBOARD = gql`
  query FetchDashboard {
    queryDashboardContents {
      flatData {
        news {
          id
          created
          lastModified
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
          lastModified
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
