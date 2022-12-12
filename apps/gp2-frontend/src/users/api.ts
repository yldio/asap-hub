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

  if (typeof filter?.onlyOnboarded === 'boolean') {
    url.searchParams.set(
      'filter[onlyOnboarded]',
      filter.onlyOnboarded.toString(),
    );
  }

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

export const patchUser = async (
  id: string,
  patch: gp2.UserPatchRequest,
  authorization: string,
): Promise<gp2.UserResponse> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
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

// Partial response type
export interface InstitutionsResponse {
  readonly number_of_results: number;
  readonly time_taken: number;
  readonly items: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email_address: string;
    readonly established: number;
    readonly types: string[];
    readonly links: string[];
    readonly aliases: string[];
    readonly acronyms: string[];
    readonly status: string;
    readonly wikipedia_url: string;
  }>;
}

export const getInstitutions = async ({
  searchQuery,
}: {
  searchQuery?: string;
} = {}): Promise<InstitutionsResponse> => {
  const url = new URL('https://api.ror.org/organizations');
  searchQuery && url.searchParams.set('query', searchQuery);
  const resp = await fetch(url.toString());
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch institutions. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
