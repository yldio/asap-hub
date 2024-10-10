import {
  ComplianceReportCreateDataObject,
  ComplianceReportDataObject,
  DataProvider,
} from '@asap-hub/model';

export type ComplianceReportDataProvider = DataProvider<
  ComplianceReportDataObject,
  ComplianceReportDataObject,
  null,
  ComplianceReportCreateDataObject
>;
