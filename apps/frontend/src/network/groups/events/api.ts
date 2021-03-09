import { ListEventResponse } from '@asap-hub/model';

import {
  GetListOptions,
  createListApiUrl,
} from '@asap-hub/frontend/src/api-util';
import { BeforeOrAfter } from '@asap-hub/frontend/src/events/api';

export const getGroupEvents = async (
  id: string,
  options: GetListOptions & BeforeOrAfter,
  authorization: string,
): Promise<ListEventResponse> => {
  const url = createListApiUrl(`groups/${id}/events`);
  if (options.before) url.searchParams.append('before', options.before);
  else if (options.after) url.searchParams.append('after', options.after);
  const resp = await fetch(url.toString(), {
    headers: { authorization },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch events for group with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
