import {
  FetchResearchTagsOptions,
  ListResearchTagDataObject,
  ResearchTagDataObject,
  ResearchTagCategory,
  ResearchTagEntity,
  isResearchTagCategory,
  isResearchTagEntity,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_RESEARCH_TAGS,
  FetchResearchTagsQuery,
  FetchResearchTagsQueryVariables,
  ResearchTagsOrder,
  ResearchTagsFilter,
} from '@asap-hub/contentful';
import { ResearchTagDataProvider } from '../types';

type ResearchTagItem = NonNullable<
  NonNullable<FetchResearchTagsQuery['researchTagsCollection']>['items'][number]
>;

export class ResearchTagContentfulDataProvider
  implements ResearchTagDataProvider
{
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(
    options: FetchResearchTagsOptions,
  ): Promise<ListResearchTagDataObject> {
    const { take = 8, skip = 0, filter = {} } = options;

    const where: ResearchTagsFilter = {};

    if (filter.type) {
      where.types_contains_all = [filter.type];
    }
    if (filter.entity) {
      where.entities_contains_all = [filter.entity];
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

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented');
  }
}

const parseResearchTag = (item: ResearchTagItem): ResearchTagDataObject => {
  if (item.category !== null && !isResearchTagCategory(item.category || '')) {
    throw new TypeError('Invalid category received from Contentful');
  }

  if (
    item.entities &&
    !item.entities.every(
      (entity) => entity !== null && isResearchTagEntity(entity),
    )
  ) {
    throw new TypeError('Invalid entity received from Contentful');
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
    entities: item.entities
      ? (item.entities as ResearchTagEntity[])
      : undefined,
  };
};
