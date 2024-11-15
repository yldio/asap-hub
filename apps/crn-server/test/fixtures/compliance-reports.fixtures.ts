import {
  ComplianceReportCreateDataObject,
  ComplianceReportDataObject,
} from '@asap-hub/model';

export const getComplianceReportDataObject =
  (): ComplianceReportDataObject => ({
    url: 'http://example.com',
    description: 'compliance report description',
    count: 1,
  });

export const getComplianceReportCreateDataObject =
  (): ComplianceReportCreateDataObject => {
    const { count, ...complianceReport } = getComplianceReportDataObject();

    return {
      ...complianceReport,
      manuscriptVersionId: 'manuscript-version-1',
    };
  };
