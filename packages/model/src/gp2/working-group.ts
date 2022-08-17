import { ListResponse } from '../common';

export type WorkingGroupDataObject = {
  id: string;
  title: string;
  shortDescription: string;
  leadingMembers?: string;
  members: unknown[];
};

export type ListWorkingGroupDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type ListWorkingGroupResponse = ListResponse<WorkingGroupResponse>;
