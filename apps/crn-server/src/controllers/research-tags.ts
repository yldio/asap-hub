import {
  FetchResearchTagsOptions,
  ListResearchTagResponse,
} from '@asap-hub/model';
import { ResearchTagDataProvider } from '../data-providers/research-tags.data-provider';

export interface ResearchTagController {
  fetch: (
    options: FetchResearchTagsOptions,
  ) => Promise<ListResearchTagResponse>;
}

export default class ResearchTags implements ResearchTagController {
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
}
