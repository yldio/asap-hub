import {
  FetchResearchThemesOptions,
  ListResearchThemeDataObject,
  ResearchThemeDataObject,
  ResearchThemeType,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_RESEARCH_THEMES,
  FetchResearchThemesQuery,
  ResearchThemeOrder,
  ResearchThemeFilter,
} from '@asap-hub/contentful';
import { ResearchThemeDataProvider } from '../types';

type ResearchThemeItem = NonNullable<
  NonNullable<
    FetchResearchThemesQuery['researchThemeCollection']
  >['items'][number]
>;

export class ResearchThemeContentfulDataProvider
  implements ResearchThemeDataProvider
{
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(
    options: FetchResearchThemesOptions,
  ): Promise<ListResearchThemeDataObject> {
    const { take = 100, skip = 0, filter } = options;

    const where: ResearchThemeFilter = filter?.types?.length
      ? { types_contains_some: [...filter.types] }
      : {};

    const response = await this.contentfulClient.request<{
      researchThemeCollection: {
        total: number;
        items: (ResearchThemeItem | null)[];
      } | null;
    }>(FETCH_RESEARCH_THEMES, {
      limit: take,
      skip,
      order: [ResearchThemeOrder.NameAsc],
      where,
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
  types: item.types?.filter((t): t is ResearchThemeType => t != null) ?? [],
});
