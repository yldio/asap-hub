import { ListGroupResponse } from '@asap-hub/model';
import { API_BASE_URL } from '@asap-hub/gp2-frontend/src/config';
import { createSentryHeaders } from '../../../api-util';

export const getUserGroups = async (
  id: string,
  authorization: string,
): Promise<ListGroupResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}/groups`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch groups for user with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
