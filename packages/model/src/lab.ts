import { ListResponse } from './common';

export type LabDataObject = {
  id: string;
  name: string;
  userIds?: string[];
};
export type ListLabDataObject = ListResponse<LabDataObject>;

export type LabResponse = LabDataObject;
export type ListLabsResponse = ListResponse<LabResponse>;
