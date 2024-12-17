import { AlgoliaClient, getEventFilters } from '@asap-hub/algolia';
import {
  createSentryHeaders,
  GetEventListOptions,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getAllFilters = ({
  before,
  after,
  constraint,
  eventType,
}: {
  before?: string;
  after?: string;
  constraint?: gp2.EventConstraint;
  eventType?: gp2.EventType[];
}) => {
  const typeFilters = eventType
    ?.map((filter) => `eventTypes:"${filter}"`)
    .join(' OR ');
  const eventFilters = getEventFilters({ before, after }, constraint);
  return [eventFilters, typeFilters].filter(Boolean).join(' AND ');
};

export type EventListOptions = GetEventListOptions<gp2.EventConstraint> &
  gp2.FetchEventSearchFilter;
export const getEvents = async (
  client: AlgoliaClient<'gp2'>,
  options: EventListOptions,
) => {
  const filters = getAllFilters(options);

  return client
    .search(
      ['event'],
      options.searchQuery,
      {
        filters,
        page: options.currentPage ?? 0,
        hitsPerPage: options.pageSize ?? 10,
      },
      !!options.before,
    )
    .catch((error: Error) => {
      throw new Error(`Could not search: ${error.message}`);
    });
};

export const getEvent = async (
  id: string,
  authorization: string,
): Promise<gp2.EventResponse | undefined> => {
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
