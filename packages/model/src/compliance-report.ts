import { UserResponse } from './user';

export type ComplianceReportDataObject = {
  id?: string;
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
  discussionId?: string;
  versionId?: string;
  manuscriptId?: string;
};
export type ComplianceReportResponse = ComplianceReportDataObject;
export type ComplianceReportFormData = Omit<
  ComplianceReportDataObject,
  'count' | 'createdDate' | 'createdBy' | 'id'
>;
export type ComplianceReportCreateDataObject = ComplianceReportFormData & {
  manuscriptVersionId: string;
  userId: string;
  discussionId?: string;
};
export type ComplianceReportPostRequest = Omit<
  ComplianceReportCreateDataObject,
  'userId'
>;
