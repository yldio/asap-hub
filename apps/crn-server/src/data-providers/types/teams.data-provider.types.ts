import {
  DataProvider,
  FetchOptions,
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
>;
