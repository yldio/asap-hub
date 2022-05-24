import { ListResponse } from './common';

export interface Lab {
  id: string;
  name: string;
}

export type ListLabsResponse = ListResponse<Lab>;
