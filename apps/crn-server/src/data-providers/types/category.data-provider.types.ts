import {
  DataProvider,
  FetchOptions,
  CategoryDataObject,
} from '@asap-hub/model';

export type CategoryDataProvider = DataProvider<
  CategoryDataObject,
  CategoryDataObject,
  FetchOptions
>;
