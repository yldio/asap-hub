import { ListResponse } from './common';

export type LabDataObject = {
  id: string;
  name: string;
  labPrincipalInvestigatorId?: string;
};
export type ListLabDataObject = ListResponse<LabDataObject>;

export type LabResponse = LabDataObject;
export type ListLabsResponse = ListResponse<LabResponse>;

export type LabDataProviderDataObject = {
  id: string;
  name: string;
  labPITeamIds: string[];
};
export type ListLabDataProviderDataObject =
  ListResponse<LabDataProviderDataObject>;

export type LabDataProviderResponse = LabDataProviderDataObject;
export type ListLabDataProviderResponse = ListResponse<LabDataProviderResponse>;
