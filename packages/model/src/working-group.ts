import { FetchOptions, ListResponse } from './common';
import { UserResponse } from './user';

export const deliverableStatus = [
  'Complete',
  'In Progress',
  'Pending',
  'Not Started',
] as const;
export type DeliverableStatus = typeof deliverableStatus[number];

export const workingGroupRole = ['Chair', 'Project Manager'] as const;
export type WorkingGroupRole = typeof workingGroupRole[number];

export type WorkingGroupLeader = {
  readonly user: UserResponse;
  readonly role: WorkingGroupRole;
  readonly workstreamRole: string;
};

export type WorkingGroupMember = {
  readonly user: UserResponse;
};

export type WorkingGroupDataObject = {
  id: string;
  title: string;
  description: string;
  externalLink?: string;
  leaders: WorkingGroupLeader[];
  members: WorkingGroupMember[];
  pointOfContact?: UserResponse;
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

type WorkingGroupFilter = {
  complete?: boolean;
};

export type FetchWorkingGroupOptions = FetchOptions<WorkingGroupFilter>;
