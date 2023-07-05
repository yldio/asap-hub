/* istanbul ignore file */

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
            sys {
              id
            }
          }
        }
        guidesCollection {
          items {
            sys {
              id
            }
            title
            icon {
              url
            }
            descriptionCollection {
              items {
                sys {
                  id
                }
                title
                bodyText
                linkUrl
                linkText
              }
            }
          }
        }
      }
    }
  }
`;
