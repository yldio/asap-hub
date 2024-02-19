import { AlgoliaClient } from '@asap-hub/algolia';
import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { API_BASE_URL } from '../../config';

export const getWorkingGroups = async (
  algoliaClient: AlgoliaClient<'crn'>,
  { searchQuery, filters, currentPage, pageSize }: GetListOptions,
): Promise<WorkingGroupListResponse> => {
  const algoliaFilters =
    filters.size === 1
      ? filters.has('Complete')
        ? 'complete:true'
        : 'complete:false'
      : undefined;
  const result = await algoliaClient.search(['working-group'], searchQuery, {
    filters: algoliaFilters,
    page: currentPage ?? undefined,
    hitsPerPage: pageSize ?? undefined,
  });

  return {
    items: result.hits,
    total: result.nbHits,
    algoliaIndexName: result.index,
    algoliaQueryId: result.queryID,
  };
};

export const getWorkingGroup = async (
  id: string,
  authorization: string,
): Promise<WorkingGroupResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/working-groups/${id}`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch working group with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
