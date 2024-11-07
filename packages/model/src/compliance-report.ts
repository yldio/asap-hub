export type ComplianceReportDataObject = {
  url: string;
  description: string;
  count: number;
};
export type ComplianceReportResponse = ComplianceReportDataObject;
export type ComplianceReportCreateDataObject = Omit<
  ComplianceReportDataObject,
  'count'
> & {
  manuscriptVersionId: string;
};
export type ComplianceReportPostRequest = ComplianceReportCreateDataObject;
export type ComplianceReportFormData = Omit<
  ComplianceReportDataObject,
  'count'
>;
