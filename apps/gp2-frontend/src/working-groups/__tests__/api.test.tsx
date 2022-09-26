import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getWorkingGroup, getWorkingGroups } from '../api';

jest.mock('../../config');

describe('getWorkingGroup', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched working group by id', async () => {
    const workingGroupResponse = gp2Fixtures.createWorkingGroupResponse();
    const { id } = workingGroupResponse;
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/working-group/${id}`)
      .reply(200, workingGroupResponse);
    const result = await getWorkingGroup(id, 'Bearer x');
    expect(result).toEqual(workingGroupResponse);
  });

  it('returns undefined if server returns 404', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/working-group/unknown-id`)
      .reply(404);
    const result = await getWorkingGroup('unknown-id', 'Bearer x');
    expect(result).toBeUndefined();
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/working-group/unknown-id`)
      .reply(500);

    await expect(
      getWorkingGroup('unknown-id', 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch working group with id unknown-id. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getWorkingGroups', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched working groups', async () => {
    const workingGroupResponse: gp2Model.ListWorkingGroupNetworkResponse =
      gp2Fixtures.createWorkingGroupNetworkResponse();
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/working-group-network')
      .reply(200, workingGroupResponse);

    const result = await getWorkingGroups('Bearer x');
    expect(result).toEqual(workingGroupResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/working-group-network')
      .reply(500);

    await expect(
      getWorkingGroups('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the working groups. Expected status 2xx. Received status 500."`,
    );
  });
});
