import { getSearchReturnType, gp2 as gp2Algolia } from '@asap-hub/algolia';

import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

export const createAlgoliaResponse = <
  EntityType extends keyof gp2Algolia.EntityResponses,
>(
  hits: Awaited<
    ReturnType<
      typeof getSearchReturnType<gp2Algolia.EntityResponses, EntityType>
    >
  >['hits'],
  overrides: Partial<
    Awaited<
      ReturnType<
        typeof getSearchReturnType<gp2Algolia.EntityResponses, EntityType>
      >
    >
  > = {},
): Awaited<
  ReturnType<typeof getSearchReturnType<gp2Algolia.EntityResponses, EntityType>>
> => ({
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

type SearchResponse = Awaited<
  ReturnType<typeof getSearchReturnType<gp2Algolia.EntityResponses, 'output'>>
>;
export const createOutputAlgoliaRecord = (
  itemIndex = 0,
): SearchResponse['hits'][number] => {
  const response = gp2Fixtures.createOutputResponse(itemIndex);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'output' },
  };
};

export const createOutputListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<SearchResponse>,
): SearchResponse =>
  createAlgoliaResponse(
    Array.from({ length: items }, (_, itemIndex) =>
      createOutputAlgoliaRecord(itemIndex),
    ),
    responseOverride,
  );
