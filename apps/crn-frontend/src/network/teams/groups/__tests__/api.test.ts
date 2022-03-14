import nock from 'nock';
import { createListGroupResponse } from '@asap-hub/fixtures';

import { API_BASE_URL } from '@asap-hub/crn-frontend/src/config';
import { getTeamGroups } from '../api';

jest.mock('../../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getTeamGroups', () => {
  it('makes an authorized GET request for the team id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/teams/42/groups')
      .reply(200, {});
    await getTeamGroups('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched team groups', async () => {
    const groups = createListGroupResponse(0);
    nock(API_BASE_URL).get('/teams/42/groups').reply(200, groups);
    expect(await getTeamGroups('42', '')).toEqual(groups);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/teams/42/groups').reply(404);
    expect(await getTeamGroups('42', '')).toBe(undefined);
  });
  it('errors for an error status', async () => {
    nock(API_BASE_URL).get('/teams/42/groups').reply(500);
    await expect(
      getTeamGroups('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch team groups with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
