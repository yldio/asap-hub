import { ListResponse } from '../common';

export const workingGroupMemberRole = ['Chair', 'Project Manager'] as const;

export type WorkingGroupMemberRole = typeof workingGroupMemberRole[number];

export type WorkingGroupMember = {
  userId: string;
  role: WorkingGroupMemberRole;
  firstName: string;
  lastName: string;
};

export type WorkingGroupDataObject = {
  id: string;
  title: string;
  shortDescription: string;
  leadingMembers?: string;
  members: WorkingGroupMember[];
};

export type ListWorkingGroupDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type ListWorkingGroupResponse = ListResponse<WorkingGroupResponse>;
