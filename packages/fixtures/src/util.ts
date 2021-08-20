import { SearchResponse } from '@algolia/client-search';

export const createAlgoliaResponse = <V extends { id?: string }>(
  data: V[],
  overrides: Partial<SearchResponse<V>> = {},
): SearchResponse<V> => ({
  hits: data.map((item, i) => ({
    ...item,
    objectID: item.id ?? `${i}`,
  })),
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
});
