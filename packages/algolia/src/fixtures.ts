import { Apps, ClientSearchResponse, EntityResponses } from '.';

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
