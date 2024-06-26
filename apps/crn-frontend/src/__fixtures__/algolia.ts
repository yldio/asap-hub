import {
  createAlgoliaResponse,
  ClientSearchResponse,
  RESEARCH_OUTPUT_ENTITY_TYPE,
} from '@asap-hub/algolia';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

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
