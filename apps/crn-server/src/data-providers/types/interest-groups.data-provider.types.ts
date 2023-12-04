import {
  FetchInterestGroupOptions,
  InterestGroupDataObject,
  DataProvider,
} from '@asap-hub/model';

export type InterestGroupDataProvider = DataProvider<
  InterestGroupDataObject,
  InterestGroupDataObject,
  FetchInterestGroupOptions
>;
