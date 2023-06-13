import {
  FetchOptions,
  ResearchTagDataObject,
  ResearchTagEntity,
  DataProvider,
} from '@asap-hub/model';

export type FetchResearchTagsFilter = {
  type?: string;
  entity?: ResearchTagEntity;
};

export type FetchResearchTagsOptions = Omit<
  FetchOptions<FetchResearchTagsFilter>,
  'search'
>;

export type ResearchTagDataProvider = DataProvider<
  ResearchTagDataObject,
  FetchResearchTagsOptions
>;
