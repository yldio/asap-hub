import {
  UserResponse,
  UserPatchRequest,
  UserAvatarPostRequest,
  ListUserResponse,
} from '@asap-hub/model';

import { API_BASE_URL } from '../../config';
import { GetListOptions, createListApiUrl } from '../../api-util';

export const getUser = async (
  id: string,
  authorization: string,
): Promise<UserResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: { authorization },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch user with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getUsers = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListUserResponse> => {
  const resp = await fetch(createListApiUrl('users', options).toString(), {
    headers: { authorization },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch user list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const patchUser = async (
  id: string,
  patch: UserPatchRequest,
  authorization: string,
): Promise<UserResponse> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      authorization,
      'content-type': 'application/json',
    },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to update user with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const postUserAvatar = async (
  id: string,
  post: UserAvatarPostRequest,
  authorization: string,
): Promise<UserResponse> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}/avatar`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to update avatar for user with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
