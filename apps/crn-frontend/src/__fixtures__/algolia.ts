import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  RESEARCH_OUTPUT_ENTITY_TYPE,
  EntityResponses,
  SearchEntityResponse,
  EntityMeta,
} from '@asap-hub/algolia';
import { ResearchOutputResponse } from '@asap-hub/model';

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
  hits: data.map((item, i) => ({
    ...item,
    objectID: `${i}`,
    __meta: { type },
  })),
});

export const createResearchOutputAlgoliaRecord = (
  itemIndex = 0,
): EntityMeta<ResearchOutputResponse> => {
  const response = createResearchOutputResponse(itemIndex);

  return {
    ...response,
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
