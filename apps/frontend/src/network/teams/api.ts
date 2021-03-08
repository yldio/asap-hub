import { TeamResponse, TeamPatchRequest } from '@asap-hub/model';
import { API_BASE_URL } from '../../config';

export const getTeam = async (
  id: string,
  authorization: string,
): Promise<TeamResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/teams/${id}`, {
    headers: { authorization },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch team with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
export const patchTeam = async (
  id: string,
  patch: TeamPatchRequest,
  authorization: string,
): Promise<TeamResponse> => {
  const resp = await fetch(`${API_BASE_URL}/teams/${id}`, {
    method: 'PATCH',
    headers: { authorization, 'content-type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to update team with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
