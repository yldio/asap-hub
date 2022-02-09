import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { SearchResponse, EntityRecord } from '@asap-hub/algolia';

export const createAlgoliaResponse = (
  data: EntityRecord<'research-output'>[],
  overrides: Partial<SearchResponse<EntityRecord<'research-output'>>> = {},
): SearchResponse<EntityRecord<'research-output'>> => ({
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

export const createResearchOutputAlgoliaRecord = (
  itemIndex = 0,
): EntityRecord<'research-output'> => {
  const response = createResearchOutputResponse(itemIndex);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'research-output' },
  };
};

export const createResearchOutputListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<SearchResponse<EntityRecord<'research-output'>>>,
): SearchResponse<EntityRecord<'research-output'>> =>
  createAlgoliaResponse(
    Array.from({ length: items }, (_, itemIndex) =>
      createResearchOutputAlgoliaRecord(itemIndex),
    ),
    responseOverride,
  );
