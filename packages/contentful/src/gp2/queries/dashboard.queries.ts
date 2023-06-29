/* instanbul */

import { gql } from 'graphql-tag';

export const FETCH_DASHBOARD = gql`
  query FetchDashboard(
    $orderAnnouncements: [DashboardAnnouncementsCollectionOrder]
  ) {
    dashboardCollection(limit: 1) {
      total
      items {
        latestStats {
          sampleCount
          articleCount
          cohortCount
        }
        announcementsCollection(order: $orderAnnouncements) {
          items {
            description
            deadline
            link
          }
        }
      }
    }
  }
`;
