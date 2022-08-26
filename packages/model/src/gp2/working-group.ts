import { ListResponse } from '../common';

const workingGroupMemberRole = [
  'Lead',
  'Co-lead',
  'Working group member',
] as const;
export type WorkingGroupMemberRole = typeof workingGroupMemberRole[number];

export const isWorkingGroupMemberRole = (
  data: string | null,
): data is WorkingGroupMemberRole =>
  workingGroupMemberRole.includes(data as WorkingGroupMemberRole);

export type WorkingGroupMember = {
  userId: string;
  role: WorkingGroupMemberRole;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

export type WorkingGroupDataObject = {
  id: string;
  title: string;
  shortDescription: string;
  description?: string;
  wgEmail?: string;
  leadEmail?: string;
  leadingMembers?: string;
  members: WorkingGroupMember[];
};

export type ListWorkingGroupDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type ListWorkingGroupResponse = ListResponse<WorkingGroupResponse>;
