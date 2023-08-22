import { ClientSearchResponse, EntityResponses } from '@asap-hub/algolia';

import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 } from '@asap-hub/model';

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

type OutputSearchResponse = ClientSearchResponse<'gp2', 'output'>;
export const createOutputAlgoliaRecord = (
  itemIndex = 0,
): OutputSearchResponse['hits'][number] => {
  const response = gp2Fixtures.createOutputResponse(itemIndex);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'output' },
  };
};

export const createOutputListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<OutputSearchResponse>,
): OutputSearchResponse =>
  createAlgoliaResponse<'output'>(
    Array.from({ length: items }, (_, itemIndex) =>
      createOutputAlgoliaRecord(itemIndex),
    ),
    responseOverride,
  );

type ProjectSearchResponse = ClientSearchResponse<'gp2', 'project'>;
export const createProjectAlgoliaRecord = (
  itemIndex = 0,
  overrides?: Partial<gp2.ProjectResponse>,
): ProjectSearchResponse['hits'][number] => {
  const response = gp2Fixtures.createProjectResponse(overrides);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'project' },
  };
};

export const createProjectListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<ProjectSearchResponse>,
): ProjectSearchResponse =>
  createAlgoliaResponse<'project'>(
    Array.from({ length: items }, (_, itemIndex) =>
      createProjectAlgoliaRecord(itemIndex),
    ),
    responseOverride,
  );
