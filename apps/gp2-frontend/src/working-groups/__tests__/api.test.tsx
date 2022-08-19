import { gp2 } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getWorkingGroups } from '../api';

jest.mock('../../config');

describe('getWorkingGroups', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched working groups', async () => {
    const workingGroupResponse: gp2.ListWorkingGroupResponse = {
      items: [
        {
          id: '42',
          title: 'Working Group 42',
          members: [],
          shortDescription: 'This is a short description 42',
          leadingMembers: 'This is a list of leading members 42',
        },
      ],
      total: 1,
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/working-groups')
      .reply(200, workingGroupResponse);

    const result = await getWorkingGroups('Bearer x');
    expect(result).toEqual(workingGroupResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/working-groups')
      .reply(500);

    await expect(
      getWorkingGroups('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the working groups. Expected status 2xx. Received status 500."`,
    );
  });
});
