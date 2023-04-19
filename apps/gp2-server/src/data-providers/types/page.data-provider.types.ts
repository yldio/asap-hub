import { PageDataObject, DataProvider } from '@asap-hub/model';

export type FetchPagesProviderOptions = {
  filter?: {
    path?: string;
  };
};

export type PageDataProvider = DataProvider<
  PageDataObject,
  FetchPagesProviderOptions
>;
