import { ListEventResponse } from '@asap-hub/model';

import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { GetEventListOptions } from '@asap-hub/gp2-frontend/src/events/options';
import createListApiUrl from '../../../CreateListApiUrl';

export const getGroupEvents = async (
  id: string,
  options: GetEventListOptions,
  authorization: string,
): Promise<ListEventResponse | undefined> => {
  const url = createListApiUrl(`groups/${id}/events`, options);
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
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch events for group with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
