import { gql } from 'graphql-tag';
import { newsContentQueryFragment } from './news.queries';
import { pagesContentQueryFragment } from './pages.queries';

export const FETCH_DASHBOARD = gql`
  query FetchDashboard {
    dashboardCollection(limit: 1, order: sys_publishedAt_DESC) {
      items {
        newsCollection(limit: 10) {
          items {
            ...NewsContent
          }
        }

        pagesCollection(limit: 10) {
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
