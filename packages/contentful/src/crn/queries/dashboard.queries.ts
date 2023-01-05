import { gql } from 'graphql-tag';
import { newsContentQueryFragment } from './news.queries';
import { pagesContentQueryFragment } from './pages.queries';

export const FETCH_DASHBOARD = gql`
  query FetchDashboard {
    dashboardCollection(limit: 1, order: sys_publishedAt_DESC) {
      items {
        newsCollection {
          items {
            ...NewsContent
          }
        }

        pagesCollection {
          items {
            ...PageContent
          }
        }
      }
    }
  }
  ${pagesContentQueryFragment}
  ${newsContentQueryFragment}
`;
