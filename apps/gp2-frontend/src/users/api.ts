import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import createListApiUrl from '../CreateListApiUrl';

export const getUsers = async (
  options: GetListOptions,
  authorization: string,
): Promise<gp2.ListUserResponse> => {
  const resp = await fetch(createListApiUrl('users', options).toString(), {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the users. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
