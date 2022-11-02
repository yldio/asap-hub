import { ListResponse } from './common';

export const deliverableStatus = [
  'Complete',
  'In Progress',
  'Pending',
  'Not Started',
] as const;
export type DeliverableStatus = typeof deliverableStatus[number];

export type WorkingGroupDataObject = {
  id: string;
  deliverables: {
    description: string;
    status: DeliverableStatus;
  }[];
};

export type WorkingGroupListDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type WorkingGroupListResponse = ListResponse<WorkingGroupResponse>;
