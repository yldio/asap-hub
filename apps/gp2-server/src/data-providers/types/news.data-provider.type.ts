import { DataProvider, FetchPaginationOptions, gp2 } from '@asap-hub/model';

export type FetchNewsProviderOptions = FetchPaginationOptions & {
  filter?: gp2.FetchNewsFilter & {
    title?: string;
  };
};

export type NewsDataProvider = DataProvider<
  gp2.NewsDataObject,
  FetchNewsProviderOptions
>;
