import nock from 'nock';
import {
  createListGroupResponse,
  createGroupResponse,
} from '@asap-hub/fixtures';

import { API_BASE_URL } from '../../../config';
import { getGroups, getGroup } from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getGroups', () => {
  it('makes an authorized GET request for groups', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/groups')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getGroups({}, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched group', async () => {
    const group = createListGroupResponse(1);
    nock(API_BASE_URL)
      .get('/groups')
      .query({ take: '10', skip: '0' })
      .reply(200, group);
    expect(await getGroups({}, '')).toEqual(group);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/groups')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(getGroups({}, '')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch group list. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getGroup', () => {
  it('makes an authorized GET request for the group id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/groups/42')
      .reply(200, {});
    await getGroup('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched group', async () => {
    const group = createGroupResponse();
    nock(API_BASE_URL).get('/groups/42').reply(200, group);
    expect(await getGroup('42', '')).toEqual(group);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/groups/42').reply(404);
    expect(await getGroup('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/groups/42').reply(500);
    await expect(getGroup('42', '')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch group with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
