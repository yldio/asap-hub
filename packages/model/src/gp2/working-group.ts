import { ListResponse } from '../common';

const workingGroupMemberRole = [
  'Lead',
  'Co-lead',
  'Working group member',
] as const;
export type WorkingGroupMemberRole = typeof workingGroupMemberRole[number];

export type WorkingGroupMember = {
  userId: string;
  role: WorkingGroupMemberRole;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

const workingGroupResourceType = ['Link', 'Note'] as const;
export type WorkingGroupResourceType = typeof workingGroupResourceType[number];

export type WorkingGroupResource = {
  type: WorkingGroupResourceType;
  title: string;
  description?: string;
  externalLink?: string;
};

export type WorkingGroupDataObject = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  primaryEmail?: string;
  secondaryEmail?: string;
  leadingMembers?: string;
  members: WorkingGroupMember[];
  resources?: WorkingGroupResource[];
};

export type ListWorkingGroupDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type ListWorkingGroupResponse = ListResponse<WorkingGroupResponse>;
