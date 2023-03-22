import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock, { DataMatcherMap } from 'nock';
import { API_BASE_URL } from '../../config';
import { getProject, getProjects, putProjectResources } from '../api';

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
