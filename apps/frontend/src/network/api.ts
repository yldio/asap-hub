import { ListGroupResponse } from '@asap-hub/model';
import { GetListOptions, createListApiUrl } from '../api-util';

export const getGroups = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListGroupResponse> => {
  const resp = await fetch(createListApiUrl('groups', options).toString(), {
    headers: { authorization },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch group list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
