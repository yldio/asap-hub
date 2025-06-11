import {
  FetchWorkingGroupOptions,
  WorkingGroupDataObject,
  WorkingGroupUpdateDataObject,
  DataProvider,
} from '@asap-hub/model';

export type WorkingGroupDataProvider = DataProvider<
  WorkingGroupDataObject,
  WorkingGroupDataObject,
  FetchWorkingGroupOptions,
  null,
  null,
  WorkingGroupUpdateDataObject
> & {
  fetchById: (
    id: string,
    publicAPI: boolean,
  ) => Promise<WorkingGroupDataObject | null>;
};
