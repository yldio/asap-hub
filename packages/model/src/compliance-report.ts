export type ComplianceReportDataObject = {
  url: string;
  description: string;
  count: number;
};
export type ComplianceReportResponse = ComplianceReportDataObject;
export type ComplianceReportFormData = Omit<
  ComplianceReportDataObject,
  'count'
>;
export type ComplianceReportCreateDataObject = ComplianceReportFormData & {
  manuscriptVersionId: string;
};
export type ComplianceReportPostRequest = ComplianceReportCreateDataObject;
