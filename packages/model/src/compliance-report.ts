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
  manuscriptId?: string;
};

export type ComplianceReportResponse = {
  complianceReport: ComplianceReportDataObject;
  status: ManuscriptStatus;
};
export type ComplianceReportFormData = Omit<
  ComplianceReportDataObject & {
    status: ManuscriptStatus;
  },
  'count' | 'createdDate' | 'createdBy' | 'id'
>;
export type ComplianceReportCreateDataObject = Omit<
  ComplianceReportFormData,
  'status'
> & {
  manuscriptVersionId: string;
  userId: string;
  discussionId?: string;
};
export type ComplianceReportPostRequest = Omit<
  ComplianceReportCreateDataObject & {
    status: ManuscriptStatus;
    sendNotifications?: boolean;
    notificationList?: string;
  },
  'userId'
>;
