import { ListGroupResponse, GroupResponse } from '@asap-hub/model';
import {
  GetListOptions,
  createListApiUrl,
  createSentryHeaders,
} from '@asap-hub/frontend-utils';
import { API_BASE_URL } from '../../config';

export const getGroups = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListGroupResponse> => {
  const resp = await fetch(
    createListApiUrl(new URL('groups', `${API_BASE_URL}/`), options).toString(),
    {
      headers: { authorization, ...createSentryHeaders() },
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch group list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
export const getGroup = async (
  id: string,
  authorization: string,
): Promise<GroupResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/groups/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch group with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
