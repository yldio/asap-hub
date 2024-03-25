import {
  Apps,
  ClientSearchResponse,
  EntityResponses,
  RESEARCH_OUTPUT_ENTITY_TYPE,
} from '@asap-hub/algolia';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

export const createAlgoliaResponse = <
  App extends Apps,
  EntityType extends keyof EntityResponses[App],
>(
  hits: ClientSearchResponse<App, EntityType>['hits'],
  overrides: Partial<ClientSearchResponse<App, EntityType>> = {},
): ClientSearchResponse<App, EntityType> => ({
  nbHits: hits.length,
  page: 0,
  nbPages: 1,
  hitsPerPage: 10,
  exhaustiveNbHits: true,
  query: '',
  params: 'page=0&hitsPerPage=10&validUntil=1629454922296',
  renderingContent: {},
  processingTimeMS: 1,
  hits,
  ...overrides,
});

type SearchResponse = ClientSearchResponse<'crn', 'research-output'>;
export const createResearchOutputAlgoliaRecord = (
  itemIndex = 0,
): SearchResponse['hits'][number] => {
  const response = createResearchOutputResponse(itemIndex);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'research-output' },
  };
};

export const createResearchOutputListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<SearchResponse>,
): SearchResponse =>
  createAlgoliaResponse<'crn', typeof RESEARCH_OUTPUT_ENTITY_TYPE>(
    Array.from({ length: items }, (_, itemIndex) =>
      createResearchOutputAlgoliaRecord(itemIndex),
    ),
    responseOverride,
  );
