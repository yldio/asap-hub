/* istanbul ignore file */

import { gql } from 'graphql-tag';

export const FETCH_COMPLIANCE_REPORTS_BY_MANUSCRIPT_VERSION_ID = gql`
  query FetchComplianceReportsByManuscriptVersionID($id: String!) {
    manuscriptVersions(id: $id) {
      linkedFrom {
        complianceReportsCollection(limit: 15) {
          total
        }
      }
    }
  }
`;
