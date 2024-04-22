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
    Array.from({ length: items }, () => createProjectAlgoliaRecord()),
    responseOverride,
  );

type EventSearchResponse = ClientSearchResponse<'gp2', 'event'>;
export const createEventAlgoliaRecord = (
  overrides?: gp2Fixtures.EventFixtureOptions,
): EventSearchResponse['hits'][number] => {
  const response = gp2Fixtures.createEventResponse(overrides);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'event' },
  };
};

export const createEventListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<EventSearchResponse>,
): EventSearchResponse =>
  createAlgoliaResponse<'event'>(
    Array.from({ length: items }, () => createEventAlgoliaRecord()),
    responseOverride,
  );

type NewsSearchResponse = ClientSearchResponse<'gp2', 'news'>;
export const createNewsAlgoliaRecord = (
  item: gp2.NewsResponse,
): NewsSearchResponse['hits'][number] => ({
  ...item,
  objectID: item.id,
  __meta: { type: 'news' },
});

export const createNewsListAlgoliaResponse = (
  items: number,
  total: number,
): NewsSearchResponse => {
  const response = createAlgoliaResponse<'news'>(
    gp2Fixtures
      .createListNewsResponse(items, total)
      .items.map((item) => createNewsAlgoliaRecord(item)),
  );

  response.nbHits = total;
  return response;
};

type WorkingGroupSearchResponse = ClientSearchResponse<'gp2', 'working-group'>;
export const createWorkingGroupAlgoliaRecord = (
  item: gp2.WorkingGroupResponse,
): WorkingGroupSearchResponse['hits'][number] => ({
  ...item,
  objectID: item.id,
  __meta: { type: 'working-group' },
});

export const createWorkingGroupListAlgoliaResponse = (
  items: number,
  total: number,
): WorkingGroupSearchResponse => {
  const response = createAlgoliaResponse<'working-group'>(
    gp2Fixtures
      .createListWorkingGroupResponse(items)
      .items.map((item) => createWorkingGroupAlgoliaRecord(item)),
  );

  response.nbHits = total;
  return response;
};

type UserSearchResponse = ClientSearchResponse<'gp2', 'user'>;
export const createUserAlgoliaRecord = (
  overrides?: Partial<gp2.UserResponse>,
): UserSearchResponse['hits'][number] => {
  const response = gp2Fixtures.createUserResponse(overrides);

  return {
    ...response,
    objectID: response.id,
    __meta: { type: 'user' },
  };
};

export const createUserListAlgoliaResponse = (
  items: number,
  responseOverride?: Partial<UserSearchResponse>,
): UserSearchResponse =>
  createAlgoliaResponse<'user'>(
    Array.from({ length: items }, (_, index) =>
      createUserAlgoliaRecord({
        displayName: `Tony Stark ${index}`,
        fullDisplayName: `Tony Stark ${index}`,
        id: `${index}`,
      }),
    ),
    responseOverride,
  );
