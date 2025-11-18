import {
  FetchResearchThemesOptions,
  ListResearchThemeDataObject,
  ResearchThemeDataObject,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_RESEARCH_THEMES,
  ResearchThemeOrder,
} from '@asap-hub/contentful';
import { ResearchThemeDataProvider } from '../types';

type ResearchThemeItem = {
  sys: { id: string };
  name: string | null;
};

export class ResearchThemeContentfulDataProvider
  implements ResearchThemeDataProvider
{
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(
    options: FetchResearchThemesOptions,
  ): Promise<ListResearchThemeDataObject> {
    const { take = 100, skip = 0 } = options;

    const response = await this.contentfulClient.request<{
      researchThemeCollection: {
        total: number;
        items: (ResearchThemeItem | null)[];
      } | null;
    }>(FETCH_RESEARCH_THEMES, {
      limit: take,
      skip,
      order: [ResearchThemeOrder.NameAsc],
    });

    const { researchThemeCollection } = response;

    return {
      total: researchThemeCollection?.total || 0,
      items:
        researchThemeCollection?.items
          ?.filter((item): item is ResearchThemeItem => item !== null)
          .map(parseResearchTheme) || [],
    };
  }
}

export const parseResearchTheme = (
  item: ResearchThemeItem,
): ResearchThemeDataObject => ({
  id: item.sys.id,
  name: item.name || '',
});
