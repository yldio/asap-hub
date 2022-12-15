import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model, InstitutionsResponse } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import {
  createUserApiUrl,
  getInstitutions,
  getUser,
  getUsers,
  patchUser,
} from '../api';

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
      })
      .reply(500);

    await expect(
      getUsers(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the users. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('patchUser', () => {
  it('makes an authorized PATCH request for the user id', async () => {
    const patch = { firstName: 'New Name' };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .patch('/users/42')
      .reply(200, {});

    await patchUser('42', patch, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('passes the patch object in the body', async () => {
    const patch = { firstName: 'New Name' };
    nock(API_BASE_URL).patch('/users/42', patch).reply(200, {});

    await patchUser('42', patch, '');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully updated user', async () => {
    const patch = { firstName: 'New Name' };
    const updated = {
      email: 'someone@example.com',
      firstName: 'New Name',
    };
    nock(API_BASE_URL).patch('/users/42', patch).reply(200, updated);

    expect(await patchUser('42', patch, '')).toEqual(updated);
  });

  it('errors for an error status', async () => {
    const patch = { firstName: 'New Name' };
    nock(API_BASE_URL).patch('/users/42', patch).reply(500, {});

    await expect(
      patchUser('42', patch, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to update user with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('createUserApiUrl', () => {
  it('uses the values for take and skip params', async () => {
    const url = createUserApiUrl({
      take: 10,
      skip: 0,
    });
    expect(url.search).toMatchInlineSnapshot(`"?take=10&skip=0"`);
  });

  it('handles requests with a search query', async () => {
    const url = createUserApiUrl({
      search: 'test123',
    });
    expect(url.searchParams.get('search')).toEqual('test123');
  });

  it.each`
    name               | value
    ${'regions'}       | ${['Africa', 'Asia']}
    ${'keywords'}      | ${['Bash', 'R']}
    ${'projects'}      | ${['a project', 'another project']}
    ${'workingGroups'} | ${['a working group', 'another working group']}
  `(
    'handles requests with filters for $name - new',
    async ({ name, value }) => {
      const url = createUserApiUrl({
        filter: { [name]: value, onlyOnboarded: false },
      });
      expect(url.searchParams.getAll(`filter[${name}]`)).toEqual(value);
      expect(url.searchParams.get('filter[onlyOnboarded]')).toEqual('false');
    },
  );
});

describe('getInstitutions', () => {
  const validResponse: InstitutionsResponse = {
    number_of_results: 1,
    time_taken: 0,
    items: [
      {
        name: 'Institution 1',
        id: 'id-1',
        email_address: 'example@example.com',
        status: '',
        wikipedia_url: '',
        established: 1999,
        aliases: [],
        acronyms: [],
        links: [],
        types: [],
      },
    ],
  };
  it('returns successfully fetched institutions', async () => {
    nock('https://api.ror.org')
      .get('/organizations')
      .query({})
      .reply(200, validResponse);
    expect(await getInstitutions()).toEqual(validResponse);
    expect(nock.isDone()).toBe(true);
  });

  it('returns queried institutions', async () => {
    nock('https://api.ror.org')
      .get('/organizations')
      .query({ query: 'abc' })
      .reply(200, validResponse);
    expect(await getInstitutions({ searchQuery: 'abc' })).toEqual(
      validResponse,
    );
    expect(nock.isDone()).toBe(true);
  });
  it('errors for an error status', async () => {
    nock('https://api.ror.org').get('/organizations').reply(500, {});

    await expect(getInstitutions()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch institutions. Expected status 2xx. Received status 500."`,
    );
  });
});
