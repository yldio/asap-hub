import { ListResponse } from './common';

export type ImpactDataObject = {
  id: string;
  name: string;
};
export type ListImpactDataObject = ListResponse<ImpactDataObject>;

export type ImpactResponse = ImpactDataObject;
export type ListImpactsResponse = ListResponse<ImpactResponse>;
