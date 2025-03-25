/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_COMPLIANCE_REPORT_BY_ID = gql`
  query FetchComplianceReportById($id: String!) {
    complianceReports(id: $id) {
      sys {
        id
        firstPublishedAt
      }
      url
      description
      createdBy {
        sys {
          id
        }
        firstName
        nickname
        lastName
        alumniSinceDate
        avatar {
          url
        }
        teamsCollection(limit: 3) {
          items {
            team {
              sys {
                id
              }
              displayName
            }
          }
        }
      }
      manuscriptVersion {
        linkedFrom {
          manuscriptsCollection(limit: 1) {
            items {
              versionsCollection(limit: 1) {
                total
              }
            }
          }
        }
      }
    }
  }
`;
