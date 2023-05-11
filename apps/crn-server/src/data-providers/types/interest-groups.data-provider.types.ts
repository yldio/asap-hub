import {
  FetchGroupOptions,
  GroupDataObject,
  DataProvider,
} from '@asap-hub/model';

export type InterestGroupDataProvider = DataProvider<
  GroupDataObject,
  FetchGroupOptions
>;
