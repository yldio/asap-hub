import {
  FetchNewsFilter,
  FetchPaginationOptions,
  DataProvider,
  NewsDataObject,
} from '@asap-hub/model';

export type FetchNewsProviderOptions = FetchPaginationOptions & {
  filter?: FetchNewsFilter & {
    title?: string;
  };
};

export type NewsDataProvider = DataProvider<
  NewsDataObject,
  FetchNewsProviderOptions
>;
