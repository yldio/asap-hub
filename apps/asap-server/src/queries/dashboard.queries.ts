import gql from 'graphql-tag';
import { newsQueryFragment } from './news.queries';

export const FETCH_DASHBOARD = gql`
  query FetchDashboard {
    queryDashboardContents {
      flatData {
        news {
          ...News
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
  ${newsQueryFragment}
`;
