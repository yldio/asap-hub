import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { API_BASE_URL } from '../../config';
import createListApiUrl from '../../CreateListApiUrl';

export const getWorkingGroup = async (
  id: string,
  authorization: string,
): Promise<WorkingGroupResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/working-groups/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch working-group with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getWorkingGroups = async (
  options: GetListOptions,
  authorization: string,
): Promise<WorkingGroupListResponse> => {
  const resp = await fetch(
    createListApiUrl('working-groups', options).toString(),
    {
      headers: { authorization, ...createSentryHeaders() },
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch working group list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
