import {
  DataProvider,
  FetchOptions,
  ListPublicTeamDataObject,
  TeamCreateDataObject,
  TeamDataObject,
  TeamListItemDataObject,
  TeamType,
  TeamUpdateDataObject,
} from '@asap-hub/model';

export type FetchTeamsOptions = FetchOptions & {
  teamType?: TeamType;
};

export type TeamDataProvider = DataProvider<
  TeamDataObject,
  TeamListItemDataObject,
  FetchTeamsOptions,
  TeamCreateDataObject,
  null,
  TeamUpdateDataObject
> & {
  fetchPublicTeams: (
    options: FetchTeamsOptions,
  ) => Promise<ListPublicTeamDataObject>;
  fetchById: (
    id: string,
    internalAPI: boolean,
  ) => Promise<TeamDataObject | null>;
};
