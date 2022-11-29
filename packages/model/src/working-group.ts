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
  title: string;
  description: string;
  externalLink?: string;
  externalLinkText?: string;
  complete?: boolean;
  deliverables: {
    description: string;
    status: DeliverableStatus;
  }[];
  readonly lastModifiedDate: string;
};

export type WorkingGroupListDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type WorkingGroupListResponse = ListResponse<WorkingGroupResponse>;
