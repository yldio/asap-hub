import {
  FetchOptions,
  ResearchTagDataObject,
  DataProvider,
} from '@asap-hub/model';

export type FetchResearchTagsFilter = {
  type?: string;
};

export type FetchResearchTagsOptions = Omit<
  FetchOptions<FetchResearchTagsFilter>,
  'search'
>;

export type ResearchTagDataProvider = DataProvider<
  ResearchTagDataObject,
  ResearchTagDataObject,
  FetchResearchTagsOptions
>;
