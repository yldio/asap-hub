import {
  createSentryHeaders,
  GetEventListOptions,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getEvents = async (
  authorization: string,
  { before, after, constraint }: GetEventListOptions<gp2.EventConstraint>,
): Promise<gp2.ListEventResponse> => {
  const url = new URL('events', `${API_BASE_URL}/`);
  if (before) {
    url.searchParams.set('before', before);
  }
  if (after) {
    url.searchParams.set('after', after);
  }

  const addFilter = (name: string, item: string) =>
    url.searchParams.append(`filter[${name}]`, item);
  if (constraint?.workingGroupId) {
    addFilter('workingGroupId', constraint?.workingGroupId);
  }
  if (constraint?.projectId) {
    addFilter('projectId', constraint?.projectId);
  }
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
