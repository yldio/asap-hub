import { AlgoliaClient } from '@asap-hub/algolia';
import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import { gp2, InstitutionsResponse } from '@asap-hub/model';
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
  const addFilter = (name: string, items?: string[]) =>
    items?.forEach((item) => url.searchParams.append(`filter[${name}]`, item));
  addFilter('regions', filter?.regions);
  addFilter('tags', filter?.tags);
  addFilter('projects', filter?.projects);
  addFilter('workingGroups', filter?.workingGroups);

  if (typeof filter?.onlyOnboarded === 'boolean') {
    url.searchParams.set(
      'filter[onlyOnboarded]',
      filter.onlyOnboarded.toString(),
    );
  }

  return url;
};

const getAllFilters = ({
  projects,
  workingGroups,
  regions,
  tags,
}: gp2.FetchUsersFilter) => {
  const addFilter = ({
    name,
    items = [],
  }: {
    name: string;
    items?: string[];
  }) => items?.map((item) => `${name}:"${item}"`).join(' OR ');

  return [
    { name: 'region', items: regions },
    { name: 'tagIds', items: tags },
    { name: 'projectIds', items: projects },
    { name: 'workingGroupIds', items: workingGroups },
  ]
    .map(addFilter)
    .filter(Boolean)
    .join(' AND ');
};

export type UserListOptions = GetListOptions & gp2.FetchUsersFilter;
export const getAlgoliaUsers = async (
  client: AlgoliaClient<'gp2'>,
  options: UserListOptions,
) =>
  client
    .search(['user'], options.searchQuery ? options.searchQuery : '', {
      page: options.currentPage ?? 0,
      hitsPerPage: options.pageSize ?? 10,
      filters: getAllFilters(options),
    })
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });

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

export const getExternalUsers = async (
  { search, take, skip }: gp2.FetchUsersOptions,
  authorization: string,
): Promise<gp2.ListExternalUserResponse> => {
  const url = new URL('external-users', `${API_BASE_URL}/`);

  search && url.searchParams.set('search', search);
  take && url.searchParams.set('take', String(take));
  skip && url.searchParams.set('skip', String(skip));

  const resp = await fetch(url.toString(), {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the external users. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
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

export const postUserAvatar = async (
  id: string,
  post: gp2.UserAvatarPostRequest,
  authorization: string,
): Promise<gp2.UserResponse> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}/avatar`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
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

export const getUsersAndExternalUsers = async (
  algoliaClient: AlgoliaClient<'gp2'>,
  { searchQuery, currentPage, pageSize }: GetListOptions,
): Promise<gp2.ListUserResponse | gp2.ListExternalUserResponse> => {
  const result = await algoliaClient.search(
    ['user', 'external-user'],
    searchQuery,
    {
      filters: undefined,
      page: currentPage ?? undefined,
      hitsPerPage: pageSize ?? undefined,
      restrictSearchableAttributes: ['displayName'],
    },
  );

  return {
    items: result.hits,
    total: result.nbHits,
    algoliaIndexName: result.index,
    algoliaQueryId: result.queryID,
  };
};
