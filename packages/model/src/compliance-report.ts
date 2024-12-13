import { UserResponse } from './user';

export type ComplianceReportDataObject = {
  url: string;
  description: string;
  count: number;
  createdDate: string;
  createdBy: Pick<
    UserResponse,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'avatarUrl'
    | 'alumniSinceDate'
  > & {
    teams: { id: string; name: string }[];
  };
};
export type ComplianceReportResponse = ComplianceReportDataObject;
export type ComplianceReportFormData = Omit<
  ComplianceReportDataObject,
  'count' | 'createdDate' | 'createdBy'
>;
export type ComplianceReportCreateDataObject = ComplianceReportFormData & {
  manuscriptVersionId: string;
  userId: string;
};
export type ComplianceReportPostRequest = Omit<
  ComplianceReportCreateDataObject,
  'userId'
>;
