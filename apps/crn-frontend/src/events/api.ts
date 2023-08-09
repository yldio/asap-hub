import { AlgoliaSearchClient, getEventFilters } from '@asap-hub/algolia';
import {
  createFeatureFlagHeaders,
  createSentryHeaders,
  GetEventListOptions,
} from '@asap-hub/frontend-utils';
import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { API_BASE_URL } from '../config';
import createListApiUrl from '../CreateListApiUrl';

export const getEvents = async (
  algoliaClient: AlgoliaSearchClient<'crn'>,
  {
    searchQuery,
    currentPage,
    pageSize,
    before,
    after,
    constraint,
  }: GetEventListOptions,
): Promise<ListEventResponse> => {
  const filters = getEventFilters({ before, after }, constraint);

  const result = await algoliaClient.search(
    ['event'],
    searchQuery,
    {
      filters,
      page: currentPage ?? undefined,
      hitsPerPage: pageSize ?? undefined,
    },
    !!before,
  );

  return {
    items: result.hits,
    total: result.nbHits,
    algoliaIndexName: result.index,
    algoliaQueryId: result.queryID,
  };
};

export const getSquidexUrl = (options: GetEventListOptions): URL =>
  options.constraint?.interestGroupId
    ? createListApiUrl(
        `interest-groups/${options.constraint?.interestGroupId}/events`,
        options,
      )
    : createListApiUrl('events', options);

export const getEvent = async (
  id: string,
  authorization: string,
): Promise<EventResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/events/${id}`, {
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
      `Failed to fetch event with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
