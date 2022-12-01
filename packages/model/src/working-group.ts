import { ListResponse } from './common';
import { UserResponse } from './user';

export const deliverableStatus = [
  'Complete',
  'In Progress',
  'Pending',
  'Not Started',
] as const;
export type DeliverableStatus = typeof deliverableStatus[number];

export const workingGroupRole = ['Project Manager'] as const;
export type WorkingGroupRole = typeof workingGroupRole[number];

type WorkingGroupMember = Pick<
  UserResponse,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'displayName'
  | 'email'
  | 'avatarUrl'
  | 'alumniSinceDate'
> & {
  workingGroupRole: WorkingGroupRole;
};

export type WorkingGroupDataObject = {
  id: string;
  title: string;
  description: string;
  externalLink?: string;
  externalLinkText?: string;
  members: WorkingGroupMember[];
  pointOfContact?: WorkingGroupMember;
  complete: boolean;
  shortText: string;
  deliverables: {
    description: string;
    status: DeliverableStatus;
  }[];
  readonly lastModifiedDate: string;
};

export type WorkingGroupListDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type WorkingGroupListResponse = ListResponse<WorkingGroupResponse>;
