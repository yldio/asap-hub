export type ComplianceReportDataObject = {
  url: string;
  description: string;
};
export type ComplianceReportResponse = ComplianceReportDataObject;
export type ComplianceReportCreateDataObject = ComplianceReportDataObject & {
  manuscriptVersionId: string;
};
export type ComplianceReportPostRequest = ComplianceReportCreateDataObject;
export type ComplianceReportFormData = ComplianceReportDataObject;
