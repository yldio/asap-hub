import { AlgoliaSearchClient, getEventFilters } from '@asap-hub/algolia';
import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { API_BASE_URL } from '../config';
import createListApiUrl from '../CreateListApiUrl';
import { GetEventListOptions } from './options';

export const getEventsFromAlgolia = async (
  algoliaClient: AlgoliaSearchClient,
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

  const result = await algoliaClient.search(['event'], searchQuery, {
    filters,
    page: currentPage ?? undefined,
    hitsPerPage: pageSize ?? undefined,
  });

  return { items: result.hits, total: result.nbHits };
};

export const getEvents = async (
  options: GetEventListOptions,
  authorization: string,
): Promise<ListEventResponse> => {
  const url = createListApiUrl('events', options);

  if (options.before) url.searchParams.append('before', options.before);
  else if (options.after) url.searchParams.append('after', options.after);

  if (options.sort) {
    url.searchParams.set('sortBy', options.sort.sortBy);
    url.searchParams.set('sortOrder', options.sort.sortOrder);
  }

  const resp = await fetch(url.toString(), {
    headers: { authorization, ...createSentryHeaders() },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch event list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getEvent = async (
  id: string,
  authorization: string,
): Promise<EventResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/events/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
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
