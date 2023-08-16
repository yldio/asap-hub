import { ListResponse } from '../common';
import { Calendar, Member, Milestone, Resource, UpdateMember } from './common';
import { KeywordDataObject } from './keywords';

export const workingGroupMemberRole = [
  'Lead',
  'Co-lead',
  'Working group member',
] as const;
export type WorkingGroupMemberRole = (typeof workingGroupMemberRole)[number];

export type WorkingGroupMember = Member<WorkingGroupMemberRole>;

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
  tags?: KeywordDataObject;
};

export type ListWorkingGroupDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type ListWorkingGroupResponse = ListResponse<WorkingGroupResponse>;

export type WorkingGroupUpdateDataObject = Partial<
  Pick<WorkingGroupDataObject, 'resources'>
> & {
  members?: UpdateMember<WorkingGroupMemberRole>[];
  tags?: Omit<KeywordDataObject, 'name'>[] | null;
};

export type WorkingGroupUpdateRequest = WorkingGroupUpdateDataObject;

export type WorkingGroupResourcesPutRequest = NonNullable<
  WorkingGroupDataObject['resources']
>;
