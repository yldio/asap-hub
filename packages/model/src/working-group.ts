import { ListResponse } from './common';

type BaseWorkingGroupDataObject = {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
};

export type BaseWorkingGroupDataObjectWithLinks = BaseWorkingGroupDataObject & {
  externalLink: string;
  externalLinkText: string;
};

export type WorkingGroupDataObject =
  | BaseWorkingGroupDataObject
  | BaseWorkingGroupDataObjectWithLinks;

export type ListWorkingGroupDataObject = ListResponse<WorkingGroupDataObject>;

export type WorkingGroupResponse = WorkingGroupDataObject;

export type ListWorkingGroupResponse = ListResponse<WorkingGroupResponse>;
