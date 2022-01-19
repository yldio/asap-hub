import {
  ResearchOutputSearchResponse,
  AlgoliaSearchResponse,
  SearchResponse,
  SearchResponseMetadata,
} from '@asap-hub/algolia';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { ResearchOutputResponse } from '@asap-hub/model';

export const createAlgoliaResponse = <
  TEntity extends Record<string, unknown>,
  TEntityName extends string,
>(
  data: TEntity[],
  overrides: Partial<Omit<AlgoliaSearchResponse<TEntity>, 'hits'>> = {},
  type: string = 'research-output',
): AlgoliaSearchResponse<SearchResponse<TEntity, TEntityName>> => ({
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
    __meta: { type } as SearchResponseMetadata<TEntityName>,
  })),
});

export const createResearchOutputAlgoliaResponse = (
  itemIndex = 0,
): SearchResponse<ResearchOutputResponse, 'research-output'> => {
  const response = createResearchOutputResponse(itemIndex);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'research-output' },
  };
};

export const createResearchOutputListAlgoliaResponse = (
  items: number,
  responseOverride?: Parameters<typeof createAlgoliaResponse>['1'],
): AlgoliaSearchResponse<ResearchOutputSearchResponse> =>
  createAlgoliaResponse<ResearchOutputResponse, 'research-output'>(
    Array.from({ length: items }, (_, itemIndex) =>
      createResearchOutputAlgoliaResponse(itemIndex),
    ),
    responseOverride,
  );
