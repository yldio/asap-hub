import { SearchResponse } from '@algolia/client-search';

export const createAlgoliaResponse = <V extends Record<string, unknown>>(
  data: V[],
  overrides: Partial<Omit<SearchResponse<unknown>, 'hits'>> = {},
): SearchResponse<V> => ({
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
  })),
});
