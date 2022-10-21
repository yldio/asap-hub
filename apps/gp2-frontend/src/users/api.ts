import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const createUserApiUrl = ({
  search,
  take,
  skip,
  filter,
}: gp2.FetchUsersOptions) => {
  const url = new URL('users', `${API_BASE_URL}/`);
  if (search) url.searchParams.set('search', search);
  if (take !== null) {
    url.searchParams.set('take', String(take));
  }
  if (skip !== null) {
    url.searchParams.set('skip', String(skip));
  }
  filter?.region?.forEach((r) => url.searchParams.append('filter[region]', r));

  return url;
};

export const getUsers = async (
  options: gp2.FetchUsersOptions,
  authorization: string,
): Promise<gp2.ListUserResponse> => {
  const resp = await fetch(createUserApiUrl(options).toString(), {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the users. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getUser = async (
  id: string,
  authorization: string,
): Promise<gp2.UserResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
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
