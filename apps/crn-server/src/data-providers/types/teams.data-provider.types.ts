import {
  DataProvider,
  FetchOptions,
  TeamCreateDataObject,
  TeamDataObject,
  TeamUpdateDataObject,
} from '@asap-hub/model';

type TeamFilter = {
  active?: boolean;
};

export type FetchTeamsOptions = {
  // select team IDs of which tools should be returned
  // leave undefined to return all teams' tools
  showTeamTools?: string[];
} & FetchOptions<TeamFilter>;

export type TeamDataProvider = DataProvider<
  TeamDataObject,
  FetchTeamsOptions,
  TeamCreateDataObject,
  null,
  TeamUpdateDataObject
>;
