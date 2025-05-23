import { AlgoliaSearchClient, ClientSearchResponse } from '@asap-hub/algolia';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 as gp2Model, InstitutionsResponse } from '@asap-hub/model';
import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { PAGE_SIZE } from '../../hooks';
import {
  createAlgoliaResponse,
  createUserListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import {
  createUserApiUrl,
  getAlgoliaUsers,
  getExternalUsers,
  getInstitutions,
  getUser,
  getUsers,
  getUsersAndExternalUsers,
  patchUser,
  postUserAvatar,
} from '../api';

jest.mock('../../config');

type Search = () => Promise<
  ClientSearchResponse<'gp2', 'user' | 'external-user'>
>;

beforeEach(() => nock.cleanAll());
describe('getUser', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
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
describe('getAlgoliaUsers', () => {
  const mockAlgoliaSearchClient = {
    search: jest.fn(),
  } as unknown as jest.Mocked<AlgoliaSearchClient<'gp2'>>;
  beforeEach(() => {
    jest.resetAllMocks();
    mockAlgoliaSearchClient.search = jest
      .fn()
      .mockResolvedValue(createUserListAlgoliaResponse(10));
  });
  const options: GetListOptions = {
    filters: new Set<string>(),
    pageSize: PAGE_SIZE,
    currentPage: 0,
    searchQuery: '',
  };

  it('makes a search request with query, default page and page size', async () => {
    await getAlgoliaUsers(mockAlgoliaSearchClient, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['user'],
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
    );
  });

  it('passes page number and page size to request', async () => {
    await getAlgoliaUsers(mockAlgoliaSearchClient, {
      ...options,
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['user'],
      '',
      expect.objectContaining({ hitsPerPage: 20, page: 1 }),
    );
  });

  it('builds a single region filter query', async () => {
    await getAlgoliaUsers(mockAlgoliaSearchClient, {
      ...options,
      regions: ['Europe'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['user'],
      '',
      expect.objectContaining({ filters: 'region:"Europe"' }),
    );
  });

  it('builds a multiple region filter query', async () => {
    await getAlgoliaUsers(mockAlgoliaSearchClient, {
      ...options,
      regions: ['Europe', 'Asia'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['user'],
      '',
      expect.objectContaining({
        filters: 'region:"Europe" OR region:"Asia"',
      }),
    );
  });
  it.each`
    given              | expected
    ${'tags'}          | ${'tagIds'}
    ${'projects'}      | ${'projectIds'}
    ${'workingGroups'} | ${'workingGroupIds'}
  `('builds a single $given filter query', async ({ given, expected }) => {
    await getAlgoliaUsers(mockAlgoliaSearchClient, {
      ...options,
      [given]: ['42'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['user'],
      '',
      expect.objectContaining({ filters: `${expected}:"42"` }),
    );
  });

  it.each`
    given              | expected
    ${'tags'}          | ${'tagIds'}
    ${'projects'}      | ${'projectIds'}
    ${'workingGroups'} | ${'workingGroupIds'}
  `('builds a multiple $given filter query', async ({ given, expected }) => {
    await getAlgoliaUsers(mockAlgoliaSearchClient, {
      ...options,
      [given]: ['42', '11'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['user'],
      '',
      expect.objectContaining({
        filters: `${expected}:"42" OR ${expected}:"11"`,
      }),
    );
  });

  it('builds a multiple filter query', async () => {
    await getAlgoliaUsers(mockAlgoliaSearchClient, {
      ...options,
      regions: ['Europe'],
      tags: ['7'],
      projects: ['11'],
      workingGroups: ['23'],
      currentPage: 1,
      pageSize: 20,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      ['user'],
      '',
      expect.objectContaining({
        filters:
          'region:"Europe" AND tagIds:"7" AND projectIds:"11" AND workingGroupIds:"23"',
      }),
    );
  });

  it('throws an error of type error', async () => {
    mockAlgoliaSearchClient.search.mockRejectedValue({
      message: 'Some Error',
    });
    await expect(
      getAlgoliaUsers(mockAlgoliaSearchClient, options),
    ).rejects.toMatchInlineSnapshot(`[Error: Could not search: Some Error]`);
  });
});
describe('getExternalUsers', () => {
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

  it('returns a successfully fetched external users', async () => {
    const externalUsers: gp2Model.ListExternalUserResponse = {
      items: [gp2Fixtures.createExternalUserResponse()],
      total: 1,
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/external-users')
      .query({
        take: 15,
        skip: 45,
        search: 'some-search',
      })
      .reply(200, externalUsers);

    const result = await getExternalUsers(options, 'Bearer x');
    expect(result).toEqual(externalUsers);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/external-users')
      .query({
        take: 15,
        skip: 45,
        search: 'some-search',
      })
      .reply(500);

    await expect(
      getExternalUsers(options, 'Bearer x'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch the external users. Expected status 2xx. Received status 500."`,
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
    ${'tags'}          | ${['Cohort', 'BLAAC-PD']}
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

describe('postUserAvatar', () => {
  it('makes an authorized POST request for the user id', async () => {
    const post: gp2Model.UserAvatarPostRequest = { avatar: '123' };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/users/42/avatar')
      .reply(200, {});

    await postUserAvatar('42', post, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('passes the post object in the body', async () => {
    const post = { avatar: '123' };
    nock(API_BASE_URL).post('/users/42/avatar', post).reply(200, {});

    await postUserAvatar('42', post, '');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully updated user', async () => {
    const post = { avatar: '123' };
    const updated: Partial<gp2Model.UserResponse> = {
      avatarUrl: 'http://example.com',
    };
    nock(API_BASE_URL).post('/users/42/avatar', post).reply(200, updated);

    expect(await postUserAvatar('42', post, '')).toEqual(updated);
  });

  it('errors for an error status', async () => {
    const post = { avatar: '123' };
    nock(API_BASE_URL).post('/users/42/avatar', post).reply(500, {});

    await expect(
      postUserAvatar('42', post, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to update avatar for user with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getUsersAndExternalUsers', () => {
  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'gp2'>;

  const defaultOptions: GetListOptions = {
    searchQuery: '',
    pageSize: null,
    currentPage: null,
    filters: new Set(),
  };

  beforeEach(() => {
    const userResponse = gp2Fixtures.createUserResponse();
    const algoliaUsersResponse = createAlgoliaResponse([
      {
        ...userResponse,
        objectID: userResponse.id,
        __meta: { type: 'user' },
      },
    ]);

    const externalUserResponse = {
      id: '1234-external-user',
      displayName: '1234 external user',
    };

    const alogliaExternalUsersResponse = createAlgoliaResponse([
      {
        ...externalUserResponse,
        objectID: externalUserResponse.id,
        __meta: { type: 'external-user' },
      },
    ]);

    search.mockReset();
    search.mockResolvedValue({
      ...algoliaUsersResponse,
      hits: [
        ...algoliaUsersResponse.hits,
        ...alogliaExternalUsersResponse.hits,
      ],
    });
  });

  it('will not filter users nor external-users by default', async () => {
    await getUsersAndExternalUsers(algoliaSearchClient, {
      ...defaultOptions,
    });
    expect(search).toHaveBeenCalledWith(
      ['user', 'external-user'],
      '',
      expect.objectContaining({
        filters: undefined,
      }),
    );
  });

  it('will not default to not specifying page and limits hits per page by default', async () => {
    await getUsersAndExternalUsers(algoliaSearchClient, {
      ...defaultOptions,
    });
    expect(search).toHaveBeenCalledWith(
      ['user', 'external-user'],
      '',
      expect.objectContaining({
        hitsPerPage: undefined,
        page: undefined,
      }),
    );
  });

  it('will pass the search query to algolia', async () => {
    await getUsersAndExternalUsers(algoliaSearchClient, {
      ...defaultOptions,
      searchQuery: 'Hello World!',
    });
    expect(search).toHaveBeenCalledWith(
      ['user', 'external-user'],
      'Hello World!',
      expect.objectContaining({}),
    );
  });
});
