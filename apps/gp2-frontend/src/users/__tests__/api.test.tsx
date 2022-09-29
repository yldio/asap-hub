import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getUsers } from '../api';

jest.mock('../../config');

describe('getUsers', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  const options: GetListOptions = {
    searchQuery: 'some-search',
    filters: new Set(['some-filter']),
    currentPage: 3,
    pageSize: 15,
  };

  it('returns a successfully fetched users', async () => {
    const usersResponse: gp2Model.ListUserResponse = {
      items: [gp2Fixtures.createUserResponse()],
      total: 1,
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users')
      .query({
        take: 15,
        skip: 45,
        search: 'some-search',
        filter: 'some-filter',
      })
      .reply(200, usersResponse);

    const result = await getUsers(options, 'Bearer x');
    expect(result).toEqual(usersResponse);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users')
      .query({
        take: 15,
        skip: 45,
        search: 'some-search',
        filter: 'some-filter',
      })
      .reply(500);

    await expect(
      getUsers(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the users. Expected status 2xx. Received status 500."`,
    );
  });
});
