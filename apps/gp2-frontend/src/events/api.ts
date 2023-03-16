import {
  createSentryHeaders,
  GetEventListOptions,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';
import createListApiUrl from '../CreateListApiUrl';

export const getEvents = async (
  authorization: string,
  options: GetEventListOptions<gp2.EventConstraint>,
): Promise<gp2.ListEventResponse> => {
  const { before, after, constraint } = options;
  const url = createListApiUrl('events', options);
  if (before) {
    url.searchParams.set('before', before);
    url.searchParams.set('sortBy', 'endDate');
    url.searchParams.set('sortOrder', 'desc');
  }
  after && url.searchParams.set('after', after);
  const addFilter = (name: string, item?: string) =>
    item && url.searchParams.append(`filter[${name}]`, item);

  addFilter('workingGroupId', constraint?.workingGroupId);
  addFilter('projectId', constraint?.projectId);
  addFilter('userId', constraint?.userId);

  const resp = await fetch(url.toString(), {
    headers: { authorization, ...createSentryHeaders() },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the Events. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
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
