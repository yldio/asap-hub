import {
  ResearchOutputSearchResponse,
  ResearchOutputSearchResponseEntity,
  SearchResponse,
  SearchResponseEntityMetadata,
} from '@asap-hub/algolia';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { ResearchOutputResponse } from '@asap-hub/model';

export const createAlgoliaResponse = <
  TEntity extends Record<string, unknown>,
  TEntityName extends string,
>(
  data: TEntity[],
  overrides: Partial<SearchResponse<TEntity, TEntityName>> = {},
  type: string = 'research-output',
): SearchResponse<TEntity, TEntityName> => ({
  nbHits: data.length,
  page: 0,
  nbPages: 1,
  hitsPerPage: 10,
  exhaustiveNbHits: true,
  query: '',
  params: 'page=0&hitsPerPage=10&validUntil=1629454922296',
  renderingContent: {},
  processingTimeMS: 1,
  ...overrides,
  hits: data.map((item, i) => ({
    ...item,
    objectID: `${i}`,
    __meta: { type } as SearchResponseEntityMetadata<TEntityName>,
  })),
});

export const createResearchOutputAlgoliaResponse = (
  itemIndex = 0,
): ResearchOutputSearchResponseEntity => {
  const response = createResearchOutputResponse(itemIndex);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'research-output' },
  };
};

export const createResearchOutputListAlgoliaResponse = (
  items: number,
  responseOverride?: ResearchOutputSearchResponse,
): ResearchOutputSearchResponse =>
  createAlgoliaResponse<ResearchOutputResponse, 'research-output'>(
    Array.from({ length: items }, (_, itemIndex) =>
      createResearchOutputAlgoliaResponse(itemIndex),
    ),
    responseOverride,
  );
