import nock from 'nock';
import { createListGroupResponse } from '@asap-hub/fixtures';

import { API_BASE_URL } from '@asap-hub/crn-frontend/src/config';
import { getUserGroups } from '../api';

jest.mock('../../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getUserGroups', () => {
  it('makes an authorized GET request for the user id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users/42/groups')
      .reply(200, {});
    await getUserGroups('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched user', async () => {
    const groups = createListGroupResponse();
    nock(API_BASE_URL).get('/users/42/groups').reply(200, groups);
    expect(await getUserGroups('42', '')).toEqual(groups);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/users/42/groups').reply(404);
    expect(await getUserGroups('42', '')).toBe(undefined);
  });
  it('errors for error status', async () => {
    nock(API_BASE_URL).get('/users/42/groups').reply(500);
    await expect(
      getUserGroups('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch groups for user with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
