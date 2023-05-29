import {
  FetchWorkingGroupOptions,
  WorkingGroupDataObject,
  WorkingGroupUpdateDataObject,
  DataProvider,
} from '@asap-hub/model';

export type WorkingGroupDataProvider = DataProvider<
  WorkingGroupDataObject,
  FetchWorkingGroupOptions,
  null,
  null,
  WorkingGroupUpdateDataObject
>;
