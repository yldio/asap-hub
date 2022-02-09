import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  SearchResponse,
  EntityRecord,
  RESEARCH_OUTPUT_ENTITY_TYPE,
} from '@asap-hub/algolia';

export const createAlgoliaResponse = (
  data: EntityRecord<typeof RESEARCH_OUTPUT_ENTITY_TYPE>[],
  overrides: Partial<
    SearchResponse<EntityRecord<typeof RESEARCH_OUTPUT_ENTITY_TYPE>>
  > = {},
): SearchResponse<EntityRecord<typeof RESEARCH_OUTPUT_ENTITY_TYPE>> => ({
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
    __meta: { type: 'research-output' },
  })),
});

export const createResearchOutputAlgoliaResponse = (
  itemIndex = 0,
): EntityRecord<typeof RESEARCH_OUTPUT_ENTITY_TYPE> => {
  const response = createResearchOutputResponse(itemIndex);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'research-output' },
  };
};

export const createResearchOutputListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<
    SearchResponse<EntityRecord<typeof RESEARCH_OUTPUT_ENTITY_TYPE>>
  >,
): SearchResponse<EntityRecord<typeof RESEARCH_OUTPUT_ENTITY_TYPE>> =>
  createAlgoliaResponse(
    Array.from({ length: items }, (_, itemIndex) =>
      createResearchOutputAlgoliaResponse(itemIndex),
    ),
    responseOverride,
  );
