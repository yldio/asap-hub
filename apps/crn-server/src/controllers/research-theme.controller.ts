import {
  FetchResearchThemesOptions,
  ListResearchThemeResponse,
} from '@asap-hub/model';
import { ResearchThemeDataProvider } from '../data-providers/types';

export default class ResearchThemeController {
  constructor(private researchThemeDataProvider: ResearchThemeDataProvider) {}

  async fetch(
    options: FetchResearchThemesOptions = {},
  ): Promise<ListResearchThemeResponse> {
    const { take = 100, skip = 0 } = options;

    return this.researchThemeDataProvider.fetch({
      take,
      skip,
    });
  }
}
