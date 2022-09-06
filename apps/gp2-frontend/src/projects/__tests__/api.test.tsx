import { createProjectResponse } from '@asap-hub/fixtures';
import { gp2 } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getProject, getProjects } from '../api';

jest.mock('../../config');

describe('getProject', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched project by id', async () => {
    const projectResponse = createProjectResponse();
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
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched projects', async () => {
    const projectsResponse: gp2.ListProjectResponse = {
      items: [createProjectResponse()],
      total: 1,
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/projects')
      .reply(200, projectsResponse);

    const result = await getProjects('Bearer x');
    expect(result).toEqual(projectsResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/projects')
      .reply(500);

    await expect(
      getProjects('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the projects. Expected status 2xx. Received status 500."`,
    );
  });
});
