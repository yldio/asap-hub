import { getComplianceReportDataObject } from '@asap-hub/fixtures';
import { ComplianceReportCreateDataObject } from '@asap-hub/model';

export const getComplianceReportCreateDataObject =
  (): ComplianceReportCreateDataObject => {
    const {
      count: _,
      createdDate: __,
      createdBy,
      ...complianceReport
    } = getComplianceReportDataObject();

    return {
      ...complianceReport,
      manuscriptVersionId: 'manuscript-version-1',
      userId: createdBy.id,
    };
  };
