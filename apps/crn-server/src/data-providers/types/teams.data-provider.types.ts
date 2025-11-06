import {
  DataProvider,
  FetchOptions,
  ListPublicTeamDataObject,
  TeamCreateDataObject,
  TeamDataObject,
  TeamListItemDataObject,
  TeamStatus,
  TeamType,
  TeamUpdateDataObject,
} from '@asap-hub/model';

type TeamFilter = {
  teamType?: TeamType;
  teamStatus?: TeamStatus[];
  // TODO: Add when available
  // researchTheme?: string[];
  // resourceType?: string[];
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
