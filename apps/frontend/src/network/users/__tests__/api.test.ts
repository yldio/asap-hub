import nock from 'nock';
import {
  UserPatchRequest,
  UserResponse,
  UserAvatarPostRequest,
} from '@asap-hub/model';
import { createUserResponse, createListUserResponse } from '@asap-hub/fixtures';

import { getUser, patchUser, postUserAvatar, getUsers } from '../api';
import { API_BASE_URL } from '../../../config';
import { GetListOptions } from '../../../api-util';
import { CARD_VIEW_PAGE_SIZE } from '../../../hooks';

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

describe('getUsers', () => {
  it('makes an authorized GET request for users', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/users')
      .query({ take: '10', skip: '0' })
      .reply(200, {});
    await getUsers(options, 'Bearer x');
    expect(nock.isDone()).toBe(true);
  });

  it('returns successfully fetched users', async () => {
    const users = createListUserResponse(1);
    nock(API_BASE_URL)
      .get('/users')
      .query({ take: '10', skip: '0' })
      .reply(200, users);
    expect(await getUsers(options, '')).toEqual(users);
  });

  it('errors for error status', async () => {
    nock(API_BASE_URL)
      .get('/users')
      .query({ take: '10', skip: '0' })
      .reply(500);
    await expect(
      getUsers(options, ''),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to fetch user list. Expected status 2xx. Received status 500."`,
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
