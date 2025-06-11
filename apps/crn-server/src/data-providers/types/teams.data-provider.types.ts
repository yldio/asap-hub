import {
  DataProvider,
  FetchOptions,
  ListPublicTeamDataObject,
  TeamCreateDataObject,
  TeamDataObject,
  TeamListItemDataObject,
  TeamUpdateDataObject,
} from '@asap-hub/model';

type TeamFilter = {
  active?: boolean;
};

export type FetchTeamsOptions = FetchOptions<TeamFilter>;

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
