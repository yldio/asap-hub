import { ListResponse } from '../common';

export type WorkingGroupResponse = {
  id: string;
  title: string;
  shortDescription: string;
  leadingMembers?: string;
  members: unknown[];
};

export type ListGroupDataObject = ListResponse<WorkingGroupResponse>;
