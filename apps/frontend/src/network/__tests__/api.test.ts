import nock from 'nock';
import { createListGroupResponse } from '@asap-hub/fixtures';

import { API_BASE_URL } from '../../config';
import { getGroups } from '../api';

jest.mock('../../config');

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
