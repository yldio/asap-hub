import { ClientSearchResponse, EntityResponses, gp2 } from '@asap-hub/algolia';
import { gp2 as gp2Model } from '@asap-hub/model';

export const toPayload =
  (
    type: keyof EntityResponses['gp2'],
  ): ((data: gp2.Payload['data']) => gp2.Payload) =>
  (data: gp2.Payload['data']): gp2.Payload =>
    ({ data, type } as gp2.Payload);

export const createAlgoliaResponse = <
  EntityType extends keyof EntityResponses['gp2'],
>(
  hits: ClientSearchResponse<'gp2', EntityType>['hits'],
  overrides: Partial<ClientSearchResponse<'gp2', EntityType>> = {},
): ClientSearchResponse<'gp2', EntityType> => ({
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

export const createProjectAlgoliaRecord = (
  response: gp2Model.ProjectResponse,
): ClientSearchResponse<'gp2', 'project'>['hits'][number] => {
  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'project' },
  };
};

export const createWorkingGroupAlgoliaRecord = (
  response: gp2Model.WorkingGroupResponse,
): ClientSearchResponse<'gp2', 'working-group'>['hits'][number] => {
  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'working-group' },
  };
};
