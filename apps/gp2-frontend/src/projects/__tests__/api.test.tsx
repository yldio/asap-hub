import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock, { DataMatcherMap } from 'nock';
import { API_BASE_URL } from '../../config';
import { PAGE_SIZE } from '../../hooks';
import { createProjectListAlgoliaResponse } from '../../__fixtures__/algolia';
import {
  getAlgoliaProjects,
  getProject,
  getProjects,
  putProjectResources,
} from '../api';

jest.mock('../../config');

describe('getProject', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched project by id', async () => {
    const projectResponse = gp2Fixtures.createProjectResponse();
    const { id } = projectResponse;
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/project/${id}`)
      .reply(200, projectResponse);
    const result = await getProject(id, 'Bearer x');
    expect(result).toEqual(projectResponse);
  });

  it('returns undefined if server returns 404', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/project/unknown-id`)
      .reply(404);
    const result = await getProject('unknown-id', 'Bearer x');
    expect(result).toBeUndefined();
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/project/unknown-id`)
      .reply(500);

    await expect(
      getProject('unknown-id', 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch project with id unknown-id. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getAlgoliaProjects', () => {
  const mockAlgoliaSearchClient = {
    search: jest.fn(),
  } as unknown as jest.Mocked<AlgoliaSearchClient<'gp2'>>;
  beforeEach(() => {
    jest.resetAllMocks();
    mockAlgoliaSearchClient.search = jest
      .fn()
      .mockResolvedValue(createProjectListAlgoliaResponse(10));
  });
  const options: GetListOptions = {
    filters: new Set<string>(),
    pageSize: PAGE_SIZE,
    currentPage: 0,
    searchQuery: '',
  };

  it('makes a search request with query, default page and page size', async () => {
    await getAlgoliaProjects(mockAlgoliaSearchClient, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['project'],
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
    );
  });

  it('passes page number and page size to request', async () => {
    await getAlgoliaProjects(mockAlgoliaSearchClient, {
      ...options,
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['project'],
      '',
      expect.objectContaining({ hitsPerPage: 20, page: 1 }),
    );
  });

  it('builds a single status filter query', async () => {
    await getAlgoliaProjects(mockAlgoliaSearchClient, {
      ...options,
      status: ['Active'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['project'],
      '',
      expect.objectContaining({ filters: 'status:"Active"' }),
    );
  });

  it('builds a multiple status filter query', async () => {
    await getAlgoliaProjects(mockAlgoliaSearchClient, {
      ...options,
      status: ['Active', 'Paused'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['project'],
      '',
      expect.objectContaining({
        filters: 'status:"Active" OR status:"Paused"',
      }),
    );
  });

  it('builds a opportunitiesAvailable filter query', async () => {
    await getAlgoliaProjects(mockAlgoliaSearchClient, {
      ...options,
      type: ['Opportunities Available'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['project'],
      '',
      expect.objectContaining({
        filters: '_tags:"Opportunities Available"',
      }),
    );
  });

  it('builds a traineeProject filter query', async () => {
    await getAlgoliaProjects(mockAlgoliaSearchClient, {
      ...options,
      type: ['Trainee Project'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['project'],
      '',
      expect.objectContaining({
        filters: 'traineeProject=1',
      }),
    );
  });
  it('builds a combined status + type filter query', async () => {
    await getAlgoliaProjects(mockAlgoliaSearchClient, {
      ...options,
      status: ['Active'],
      type: ['Trainee Project'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['project'],
      '',
      expect.objectContaining({
        filters: 'status:"Active" AND traineeProject=1',
      }),
    );
  });

  it('throws an error of type error', async () => {
    mockAlgoliaSearchClient.search.mockRejectedValue({
      message: 'Some Error',
    });
    await expect(
      getAlgoliaProjects(mockAlgoliaSearchClient, options),
    ).rejects.toMatchInlineSnapshot(`[Error: Could not search: Some Error]`);
  });
});

describe('getProjects', () => {
  const options: GetListOptions = {
    searchQuery: '',
    currentPage: 1,
    pageSize: 10,
    filters: new Set(),
  };
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched projects', async () => {
    const projectsResponse: gp2Model.ListProjectResponse = {
      items: [gp2Fixtures.createProjectResponse()],
      total: 1,
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/projects')
      .query({
        skip: 10,
        take: 10,
      })
      .reply(200, projectsResponse);

    const result = await getProjects('Bearer x', options);
    expect(result).toEqual(projectsResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/projects')
      .query({
        skip: 10,
        take: 10,
      })
      .reply(500);

    await expect(
      getProjects('Bearer x', options),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the projects. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('putProjectsResources', () => {
  afterEach(nock.cleanAll);
  const payload = gp2Fixtures.projectResources;

  it('makes an authorized PUT request to update a project resources', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .put('/project/11/resources', payload as unknown as DataMatcherMap)
      .reply(200, { id: 123 });

    await putProjectResources('11', payload, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL).put('/project/11/resources').reply(500, {});

    await expect(
      putProjectResources('11', payload, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to update project resources for id 11 Expected status 200. Received status 500."`,
    );
  });
});
