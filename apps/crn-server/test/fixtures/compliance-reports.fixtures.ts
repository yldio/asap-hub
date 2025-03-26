import { getComplianceReportDataObject } from '@asap-hub/fixtures';
import {
  ComplianceReportCreateDataObject,
  ManuscriptStatus,
} from '@asap-hub/model';

export const getComplianceReportCreateDataObject =
  (): ComplianceReportCreateDataObject & {
    status: ManuscriptStatus;
  } => {
    const {
      count: _,
      createdDate: __,
      createdBy,
      ...complianceReport
    } = getComplianceReportDataObject();

    return {
      ...complianceReport,
      status: 'Review Compliance Report',
      manuscriptVersionId: 'manuscript-version-1',
      userId: createdBy.id,
    };
  };
