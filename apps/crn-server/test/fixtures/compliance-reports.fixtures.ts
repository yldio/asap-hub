import {
  ComplianceReportCreateDataObject,
  ComplianceReportDataObject,
} from '@asap-hub/model';

export const getComplianceReportDataObject =
  (): ComplianceReportDataObject => ({
    url: 'http://example.com',
    description: 'compliance report description',
  });

export const getComplianceReportCreateDataObject =
  (): ComplianceReportCreateDataObject => {
    const complianceReport = getComplianceReportDataObject();

    return {
      ...complianceReport,
      manuscriptVersionId: 'manuscript-version-1',
    };
  };
