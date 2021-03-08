import { ListGroupResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../../../config';

export const getTeamGroups = async (
  id: string,
  authorization: string,
): Promise<ListGroupResponse> => {
  const resp = await fetch(`${API_BASE_URL}/teams/${id}/groups`, {
    headers: { authorization },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch team groups with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
