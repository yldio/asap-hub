import { ManuscriptStatus } from './manuscript';
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
};

export type ComplianceReportResponse = {
  complianceReport: ComplianceReportDataObject & {
    manuscriptId: string;
  };
  status: ManuscriptStatus;
};
export type ComplianceReportFormData = Omit<
  ComplianceReportDataObject & {
    manuscriptId: string;
    status: ManuscriptStatus;
  },
  'count' | 'createdDate' | 'createdBy' | 'id'
>;
export type ComplianceReportCreateDataObject = Omit<
  ComplianceReportFormData,
  'status' | 'manuscriptId'
> & {
  manuscriptVersionId: string;
  userId: string;
  discussionId?: string;
};
export type ComplianceReportPostRequest = Omit<
  ComplianceReportCreateDataObject & {
    status: ManuscriptStatus;
    manuscriptId: string;
    sendNotifications?: boolean;
    notificationList?: string;
  },
  'userId'
>;
