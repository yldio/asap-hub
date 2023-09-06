import type { AlgoliaClient } from '@asap-hub/algolia';
import {
  createFeatureFlagHeaders,
  createSentryHeaders,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import {
  ExternalAuthorResponse,
  InstitutionsResponse,
  ListResponse,
  ListUserResponse,
  UserAvatarPostRequest,
  UserPatchRequest,
  UserResponse,
  userTags,
} from '@asap-hub/model';

import { API_BASE_URL } from '../../config';

export const getUser = async (
  id: string,
  authorization: string,
): Promise<UserResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
      ...createFeatureFlagHeaders(),
    },
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
  algoliaClient: AlgoliaClient<'crn'>,
  { searchQuery, filters, currentPage, pageSize }: GetListOptions,
): Promise<ListUserResponse> => {
  const isTagFilter = (filter: string) =>
    (userTags as unknown as string[]).includes(filter);
  const filterArray = Array.from(filters);

  const tagFilters = filterArray
    .filter(isTagFilter)
    .map((filter) => `_tags:"${filter}"`)
    .join(' OR ');

  const roleFilters = filterArray
    .filter((filter) => !isTagFilter(filter))
    .map((filter) => `teams.role:"${filter}"`)
    .join(' OR ');

  const algoliaFilters =
    tagFilters && roleFilters
      ? `(${tagFilters}) AND (${roleFilters})`
      : tagFilters || roleFilters;

  try {
    const result = await algoliaClient.search(['user'], searchQuery, {
      filters: algoliaFilters.length > 0 ? algoliaFilters : undefined,
      page: currentPage ?? undefined,
      hitsPerPage: pageSize ?? undefined,
    });

    return {
      items: result.hits,
      total: result.nbHits,
      algoliaIndexName: result.index,
      algoliaQueryId: result.queryID,
    };
  } catch (error) {
    throw new Error(`Failed to fetch users.`);
  }
};

export const getUsersAndExternalAuthors = async (
  algoliaClient: AlgoliaClient<'crn'>,
  { searchQuery, currentPage, pageSize }: GetListOptions,
): Promise<ListResponse<UserResponse | ExternalAuthorResponse>> => {
  try {
    const result = await algoliaClient.search(
      ['user', 'external-author'],
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
  } catch (error) {
    throw new Error(`Failed to fetch users and authors.`);
  }
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
      ...createSentryHeaders(),
      ...createFeatureFlagHeaders(),
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
      ...createSentryHeaders(),
      ...createFeatureFlagHeaders(),
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
