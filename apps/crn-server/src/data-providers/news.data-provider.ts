import {
  FetchNewsFilter,
  FetchPaginationOptions,
  ListNewsDataObject,
  NewsDataObject,
} from '@asap-hub/model';

export interface NewsDataProvider {
  fetchById(id: string): Promise<NewsDataObject | null>;
  fetch: (options?: FetchNewsProviderOptions) => Promise<ListNewsDataObject>;
}

export type FetchNewsProviderOptions = FetchPaginationOptions & {
  filter: FetchNewsFilter & {
    title?: string;
  };
};
