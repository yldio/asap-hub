import {
  FetchResearchTagsFilter,
  FetchResearchTagsOptions,
  ListResearchTagResponse,
  ResearchTagDataObject,
} from '@asap-hub/model';
import { ResearchTagDataProvider } from '../data-providers/types';
import { fetchAll } from '../utils/fetch-all';

type FetchAllOptions = Omit<FetchResearchTagsOptions, 'take' | 'skip'>;

export default class ResearchTagController {
  constructor(private researchTagsDataProvider: ResearchTagDataProvider) {}

  async fetch(
    options: FetchResearchTagsOptions,
  ): Promise<ListResearchTagResponse> {
    const { take = 8, skip = 0, filter } = options;

    return this.researchTagsDataProvider.fetch({
      take,
      skip,
      filter,
    });
  }

  async fetchAll(options: FetchAllOptions): Promise<ListResearchTagResponse> {
    const { filter } = options;
    return fetchAll<ResearchTagDataObject, FetchResearchTagsFilter>(
      this.researchTagsDataProvider,
      filter,
    );
  }
}
