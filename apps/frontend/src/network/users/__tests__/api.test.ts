import nock from 'nock';
import {
  UserAvatarPostRequest,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import { createListUserResponse, createUserResponse } from '@asap-hub/fixtures';

import type { AlgoliaSearchClient } from '@asap-hub/algolia';

import {
  getInstitutions,
  getUser,
  getUsersLegacy,
  getUsers,
  InstitutionsResponse,
  patchUser,
  postUserAvatar,
} from '../api';
import { API_BASE_URL } from '../../../config';
import { GetListOptions } from '../../../api-util';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';
import { createAlgoliaResponse } from '../../../__fixtures__/algolia';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: GetListOptions = {
  filters: new Set(),
  pageSize: CARD_VIEW_PAGE_SIZE,
  currentPage: 0,
  searchQuery: '',
};

describe('getUsersLegacy', () => {
  it('makes an authorized GET request for users', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getUsersLegacy(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched users', async () => {
    const users = createListUserResponse(1);
    nock(API_BASE_URL)
      .get('/users')
      .query({ take: '10', skip: '0' })
      .reply(200, users);
    expect(await getUsersLegacy(options, '')).toEqual(users);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/users')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getUsersLegacy(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch user list. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('getUsers', () => {
  const searchEntity: jest.MockedFunction<AlgoliaSearchClient['searchEntity']> =
    jest.fn();

  const algoliaSearchClient = {
    searchEntity,
  } as unknown as AlgoliaSearchClient;

  const defaultOptions: GetListOptions = {
    searchQuery: '',
    pageSize: null,
    currentPage: null,
    filters: new Set(),
  };

  beforeEach(() => {
    searchEntity.mockReset();
    searchEntity.mockResolvedValue(createAlgoliaResponse('user', []));
  });

  it('will not filter users by default', async () => {
    await getUsers(algoliaSearchClient, {
      ...defaultOptions,
    });
    expect(searchEntity).toHaveBeenCalledWith(
      'user',
      '',
      expect.objectContaining({
        filters: undefined,
      }),
    );
  });

  it('will not default to not specifying page and limits hits per page by default', async () => {
    await getUsers(algoliaSearchClient, {
      ...defaultOptions,
    });
    expect(searchEntity).toHaveBeenCalledWith(
      'user',
      '',
      expect.objectContaining({
        hitsPerPage: undefined,
        page: undefined,
      }),
    );
  });

  it('will pass the search query to algolia', async () => {
    await getUsers(algoliaSearchClient, {
      ...defaultOptions,
      searchQuery: 'Hello World!',
    });
    expect(searchEntity).toHaveBeenCalledWith(
      'user',
      'Hello World!',
      expect.objectContaining({}),
    );
  });

  it('can filter the users by a single team role', async () => {
    await getUsers(algoliaSearchClient, {
      ...defaultOptions,
      filters: new Set(['Collaborating PI']),
    });
    expect(searchEntity).toHaveBeenCalledWith('user', '', {
      filters: 'teams.role:"Collaborating PI"',
    });
  });

  it('can filter the users by multiple team roles (OR)', async () => {
    await getUsers(algoliaSearchClient, {
      ...defaultOptions,
      filters: new Set(['Collaborating PI', 'Project Manager']),
    });
    expect(searchEntity).toHaveBeenCalledWith('user', '', {
      filters: 'teams.role:"Collaborating PI" OR teams.role:"Project Manager"',
    });
  });

  it('returns successfully fetched users', async () => {
    const users = createListUserResponse(1);
    const transformedUsers = {
      ...users,
      items: users.items.map((item) => ({
        ...item,
        objectID: '',
        __meta: {
          type: 'user' as const,
        },
      })),
    };
    searchEntity.mockResolvedValueOnce({
      hits: transformedUsers.items,
      nbHits: transformedUsers.total,
      page: 0,
      nbPages: 0,
      hitsPerPage: 0,
      processingTimeMS: 0,
      exhaustiveNbHits: false,
      query: '',
      params: '',
    });
    expect(await getUsers(algoliaSearchClient, defaultOptions)).toEqual(
      transformedUsers,
    );
  });
});

describe('getUser', () => {
  it('makes an authorized GET request for the user id', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users/42')
      .reply(200, {});
    await getUser('42', 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully fetched user', async () => {
    const user = createUserResponse();
    nock(API_BASE_URL).get('/users/42').reply(200, user);
    expect(await getUser('42', '')).toEqual(user);
  });

  it('returns undefined for a 404', async () => {
    nock(API_BASE_URL).get('/users/42').reply(404);
    expect(await getUser('42', '')).toBe(undefined);
  });

  it('errors for another status', async () => {
    nock(API_BASE_URL).get('/users/42').reply(500);
    await expect(getUser('42', '')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch user with id 42. Expected status 2xx or 404. Received status 500."`,
    );
  });
});

describe('patchUser', () => {
  it('makes an authorized PATCH request for the user id', async () => {
    const patch: UserPatchRequest = { biography: 'New Bio' };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .patch('/users/42')
      .reply(200, {});

    await patchUser('42', patch, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('passes the patch object in the body', async () => {
    const patch = { biography: 'New Bio' };
    nock(API_BASE_URL).patch('/users/42', patch).reply(200, {});

    await patchUser('42', patch, '');
    expect(nock.isDone()).toBe(true);
  });

  it('returns a successfully updated user', async () => {
    const patch = { biography: 'New Bio' };
    const updated: Partial<UserResponse> = {
      email: 'someone@example.com',
      biography: 'New Bio',
    };
    nock(API_BASE_URL).patch('/users/42', patch).reply(200, updated);

    expect(await patchUser('42', patch, '')).toEqual(updated);
  });

  it('errors for an error status', async () => {
    const patch = { biography: 'New Bio' };
    nock(API_BASE_URL).patch('/users/42', patch).reply(500, {});

    await expect(
      patchUser('42', patch, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to update user with id 42. Expected status 2xx. Received status 500."`,
    );
  });
});

describe('postUserAvatar', () => {
  it('makes an authorized POST request for the user id', async () => {
    const post: UserAvatarPostRequest = { avatar: '123' };
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
    const updated: Partial<UserResponse> = {
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
  it('returns successfully fetched users', async () => {
    nock('https://api.ror.org')
      .get('/organizations')
      .query({})
      .reply(200, validResponse);
    expect(await getInstitutions()).toEqual(validResponse);
    expect(nock.isDone()).toBe(true);
  });

  it('returns queried users', async () => {
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
