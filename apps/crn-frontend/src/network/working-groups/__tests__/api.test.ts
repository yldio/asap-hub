import { createWorkingGroupResponse } from '@asap-hub/fixtures';
import nock from 'nock';
import { API_BASE_URL } from '../../../config';
import { getWorkingGroup } from '../api';

describe('getWorkingGroup', () => {
  it('makes an authorized GET request for the working group id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/working-groups/42')
      .reply(200, {});
    await getWorkingGroup('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched working-group', async () => {
    const group = createWorkingGroupResponse({});
    nock(API_BASE_URL).get('/working-groups/42').reply(200, group);
    expect(await getWorkingGroup('42', '')).toEqual(group);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/working-groups/42').reply(404);
    expect(await getWorkingGroup('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/working-groups/42').reply(500);
    await expect(
      getWorkingGroup('42', ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch working-group with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});
