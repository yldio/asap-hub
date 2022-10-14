import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getUser, getUsers } from '../api';

jest.mock('../../config');

describe('getUser', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched user by id', async () => {
    const userResponse = gp2Fixtures.createUserResponse();
    const { id } = userResponse;
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/users/${id}`)
      .reply(200, userResponse);
    const result = await getUser(id, 'Bearer x');
    expect(result).toEqual(userResponse);
  });

  it('returns undefined if server returns 404', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/users/unknown-id`)
      .reply(404);
    const result = await getUser('unknown-id', 'Bearer x');
    expect(result).toBeUndefined();
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get(`/users/unknown-id`)
      .reply(500);

    await expect(
      getUser('unknown-id', 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch user with id unknown-id. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('getUsers', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  const options: gp2Model.FetchUsersOptions = {
    search: 'some-search',
    filter: {},
    skip: 45,
    take: 15,
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
