import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { ListWorkingGroupsResponse } from '@asap-hub/model/build/gp2';
import { API_BASE_URL } from '../config';

export const getWorkingGroups = async (
  authorization: string,
): Promise<ListWorkingGroupsResponse> => {
  const resp = await fetch(`${API_BASE_URL}/working-groups`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the working groups. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
