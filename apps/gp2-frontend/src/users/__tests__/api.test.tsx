import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getUsers } from '../api';

jest.mock('../../config');

describe('getUsers', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched users', async () => {
    const usersResponse: gp2Model.ListUserResponse = {
      items: [gp2Fixtures.createUserResponse()],
      total: 1,
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users')
      .reply(200, usersResponse);

    const result = await getUsers('Bearer x');
    expect(result).toEqual(usersResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users')
      .reply(500);

    await expect(
      getUsers('Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the users. Expected status 2xx. Received status 500."`,
    );
  });
});
