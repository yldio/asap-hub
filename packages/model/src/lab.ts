import { ListResponse } from './common';

export interface LabResponse {
  id: string;
  name: string;
}

export type ListLabsResponse = ListResponse<LabResponse>;
