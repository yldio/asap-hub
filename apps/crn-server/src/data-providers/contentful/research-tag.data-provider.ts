import {
  FetchResearchTagsOptions,
  ListResearchTagDataObject,
  ResearchTagDataObject,
  ResearchTagCategory,
  isResearchTagCategory,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_RESEARCH_TAGS,
  FetchResearchTagsQuery,
  FetchResearchTagsQueryVariables,
  ResearchTagsOrder,
  ResearchTagsFilter,
  Environment,
  addLocaleToFields,
  FetchResearchTagsByIdQuery,
  FetchResearchTagsByIdQueryVariables,
  FETCH_RESEARCH_TAGS_BY_ID,
} from '@asap-hub/contentful';
import { ResearchTagDataProvider } from '../types';

export type ResearchTagItem = NonNullable<
  NonNullable<FetchResearchTagsQuery['researchTagsCollection']>['items'][number]
>;

export class ResearchTagContentfulDataProvider
  implements ResearchTagDataProvider
{
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}
  async fetch(
    options: FetchResearchTagsOptions,
  ): Promise<ListResearchTagDataObject> {
    const { search, take = 8, skip = 0, filter = {} } = options;

    const where: ResearchTagsFilter = {};
    const words = (search || '').split(' ').filter(Boolean); // removes whitespaces

    if (words.length) {
      const filters: ResearchTagsFilter[] = words.reduce(
        (acc: ResearchTagsFilter[], word: string) =>
          acc.concat([
            {
              OR: [{ name_contains: word }],
            },
          ]),
        [],
      );
      where.AND = filters;
    }

    if (filter.type) {
      where.types_contains_all = [filter.type];
    }

    const { researchTagsCollection } = await this.contentfulClient.request<
      FetchResearchTagsQuery,
      FetchResearchTagsQueryVariables
    >(FETCH_RESEARCH_TAGS, {
      limit: take,
      skip,
      order: [ResearchTagsOrder.NameAsc],
      where,
    });

    return {
      total: researchTagsCollection?.total || 0,
      items:
        researchTagsCollection?.items
          ?.filter((item): item is ResearchTagItem => item !== null)
          .map(parseResearchTag) || [],
    };
  }

  async fetchById(id: string): Promise<ResearchTagDataObject | null> {
    const { researchTags } = await this.contentfulClient.request<
      FetchResearchTagsByIdQuery,
      FetchResearchTagsByIdQueryVariables
    >(FETCH_RESEARCH_TAGS_BY_ID, { id });

    if (!researchTags) {
      return null;
    }
    return parseResearchTag(researchTags);
  }

  async create(name: string): Promise<string> {
    const environment = await this.getRestClient();

    const researchTagEntry = await environment.createEntry('researchTags', {
      fields: addLocaleToFields({
        name,
      }),
    });

    await researchTagEntry.publish();

    return researchTagEntry.sys.id;
  }
}

const parseResearchTag = (item: ResearchTagItem): ResearchTagDataObject => {
  if (item.category !== null && !isResearchTagCategory(item.category || '')) {
    throw new TypeError('Invalid category received from Contentful');
  }

  const types =
    item.types?.filter((type): type is string => typeof type === 'string') ||
    undefined;

  return {
    id: item.sys.id,
    name: item.name || '',
    types,
    category: item.category
      ? (item.category as ResearchTagCategory)
      : undefined,
  };
};
