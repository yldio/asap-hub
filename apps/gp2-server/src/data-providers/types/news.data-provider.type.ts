import {
  DataProvider,
  FetchNewsFilter,
  FetchPaginationOptions,
  gp2,
} from '@asap-hub/model';

export type FetchNewsProviderOptions = FetchPaginationOptions & {
  filter?: FetchNewsFilter & {
    title?: string;
  };
};

export type NewsDataProvider = DataProvider<
  gp2.NewsDataObject,
  FetchNewsProviderOptions
>;
