import nock from 'nock';
import { createListInterestGroupResponse } from '@asap-hub/fixtures';

import { API_BASE_URL } from '../../../../config';
import { getTeamInterestGroups } from '../api';

jest.mock('../../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getTeamGroups', () => {
  it('makes an authorized GET request for the team id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/teams/42/interest-groups')
      .reply(200, {});
    await getTeamInterestGroups('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched team groups', async () => {
    const groups = createListInterestGroupResponse(0);
    nock(API_BASE_URL).get('/teams/42/interest-groups').reply(200, groups);
    expect(await getTeamInterestGroups('42', '')).toEqual(groups);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/teams/42/interest-groups').reply(404);
    expect(await getTeamInterestGroups('42', '')).toBe(undefined);
  });
  it('errors for an error status', async () => {
    nock(API_BASE_URL).get('/teams/42/interest-groups').reply(500);
    await expect(
      getTeamInterestGroups('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch team groups with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
