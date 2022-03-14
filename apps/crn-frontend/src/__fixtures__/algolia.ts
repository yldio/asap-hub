import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  EntityRecord,
  EntityHit,
  RESEARCH_OUTPUT_ENTITY_TYPE,
  EntityResponses,
  SearchEntityResponse,
} from '@asap-hub/algolia';

export const createAlgoliaResponse = <EntityType extends keyof EntityResponses>(
  type: EntityType,
  data: EntityResponses[EntityType][],
  overrides: Partial<SearchEntityResponse<EntityType>> = {},
): SearchEntityResponse<EntityType> => ({
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
  hits: data.map(
    (item, i) =>
      ({
        ...item,
        objectID: `${i}`,
        __meta: { type },
      } as EntityHit<EntityType>),
  ),
});

export const createResearchOutputAlgoliaRecord = (
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
    SearchEntityResponse<typeof RESEARCH_OUTPUT_ENTITY_TYPE>
  >,
): SearchEntityResponse<typeof RESEARCH_OUTPUT_ENTITY_TYPE> =>
  createAlgoliaResponse<typeof RESEARCH_OUTPUT_ENTITY_TYPE>(
    RESEARCH_OUTPUT_ENTITY_TYPE,
    Array.from({ length: items }, (_, itemIndex) =>
      createResearchOutputAlgoliaRecord(itemIndex),
    ),
    responseOverride,
  );
