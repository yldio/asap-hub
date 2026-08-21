import { AlgoliaClient, getEventFilters } from '@asap-hub/algolia';
import {
  BackendError,
  createSentryHeaders,
  GetEventListOptions,
} from '@asap-hub/frontend-utils';
import {
  EventResponse,
  EventUpdateDetailsRequest,
  ListEventResponse,
} from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getEvents = async (
  algoliaClient: AlgoliaClient<'crn'>,
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
    total: result.nbHits ?? 0,
    algoliaIndexName: result.index,
    algoliaQueryId: result.queryID,
  };
};

export const getEvent = async (
  id: string,
  authorization: string,
): Promise<EventResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/events/${id}`, {
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
      `Failed to fetch event with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const patchEvent = async (
  id: string,
  data: EventUpdateDetailsRequest,
  authorization: string,
): Promise<EventResponse> => {
  const resp = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PATCH',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) {
    throw new BackendError(
      `Failed to update event ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      await resp.json().catch(() => undefined),
      resp.status,
    );
  }
  return resp.json();
};
