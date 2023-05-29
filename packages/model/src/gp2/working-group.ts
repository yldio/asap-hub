import { ListResponse } from '../common';
import { Calendar, Milestone, Resource } from './common';

export const workingGroupMemberRole = [
  'Lead',
  'Co-lead',
  'Working group member',
] as const;
export type WorkingGroupMemberRole = (typeof workingGroupMemberRole)[number];
export const isWorkingGroupMemberRole = (
  data: string,
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
  description: string;
  primaryEmail?: string;
  secondaryEmail?: string;
  leadingMembers?: string;
  members: WorkingGroupMember[];
  milestones: Milestone[];
  resources?: Resource[];
  calendar?: Calendar;
};

export type ListWorkingGroupDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type ListWorkingGroupResponse = ListResponse<WorkingGroupResponse>;

export type WorkingGroupUpdateDataObject = Partial<
  Pick<WorkingGroupDataObject, 'resources'>
> & {
  members?: Pick<WorkingGroupMember, 'userId' | 'role'>[];
};

export type WorkingGroupUpdateRequest = WorkingGroupUpdateDataObject;

export type WorkingGroupResourcesPutRequest = NonNullable<
  WorkingGroupDataObject['resources']
>;
