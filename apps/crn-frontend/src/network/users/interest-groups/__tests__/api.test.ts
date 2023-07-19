import nock from 'nock';
import { createListInterestGroupResponse } from '@asap-hub/fixtures';

import { API_BASE_URL } from '../../../../config';
import { getUserInterestGroups } from '../api';

jest.mock('../../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getUserInterestGroups', () => {
  it('makes an authorized GET request for the user id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users/42/interest-groups')
      .reply(200, {});
    await getUserInterestGroups('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched user', async () => {
    const groups = createListInterestGroupResponse();
    nock(API_BASE_URL).get('/users/42/interest-groups').reply(200, groups);
    expect(await getUserInterestGroups('42', '')).toEqual(groups);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/users/42/interest-groups').reply(404);
    expect(await getUserInterestGroups('42', '')).toBe(undefined);
  });
  it('errors for error status', async () => {
    nock(API_BASE_URL).get('/users/42/interest-groups').reply(500);
    await expect(
      getUserInterestGroups('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch groups for user with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
