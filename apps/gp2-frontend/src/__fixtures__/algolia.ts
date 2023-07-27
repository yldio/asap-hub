import {
  EntityHit,
  EntityRecord,
  gp2 as gp2Algolia,
  SearchEntityResponse,
} from '@asap-hub/algolia';

import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

export const createAlgoliaResponse = <
  T extends gp2Algolia.EntityResponses,
  K extends keyof T,
>(
  hits: EntityHit<T, K>[],
  overrides: Partial<SearchEntityResponse<T, K>> = {},
): SearchEntityResponse<T, K> => ({
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

export const createOutputAlgoliaRecord = (
  itemIndex = 0,
): EntityRecord<
  gp2Algolia.EntityResponses,
  typeof gp2Algolia.OUTPUT_ENTITY_TYPE
> => {
  const response = gp2Fixtures.createOutputResponse(itemIndex);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'output' },
  };
};

export const createOutputListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<
    SearchEntityResponse<
      gp2Algolia.EntityResponses,
      typeof gp2Algolia.OUTPUT_ENTITY_TYPE
    >
  >,
): SearchEntityResponse<
  gp2Algolia.EntityResponses,
  typeof gp2Algolia.OUTPUT_ENTITY_TYPE
> =>
  createAlgoliaResponse<
    gp2Algolia.EntityResponses,
    typeof gp2Algolia.OUTPUT_ENTITY_TYPE
  >(
    Array.from({ length: items }, (_, itemIndex) =>
      createOutputAlgoliaRecord(itemIndex),
    ),
    responseOverride,
  );
