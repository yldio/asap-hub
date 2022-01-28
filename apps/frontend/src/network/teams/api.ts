import {
  ListTeamResponse,
  ResearchOutput,
  ResearchOutputResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import {
  createListApiUrl,
  createSentryHeaders,
  GetListOptions,
} from '../../api-util';
import { API_BASE_URL } from '../../config';

export const getTeam = async (
  id: string,
  authorization: string,
): Promise<TeamResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/teams/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
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

export const getTeams = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListTeamResponse> => {
  const resp = await fetch(createListApiUrl('teams', options).toString(), {
    headers: { authorization, ...createSentryHeaders() },
  });

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch team list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
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
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to update team with id ${id}. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export type CreateTeamResearchOutput = (
  teamId: string,
  researchOutput: Partial<ResearchOutput>,
  authorization: string,
) => Promise<Partial<ResearchOutputResponse>>;
export const createTeamResearchOutput: CreateTeamResearchOutput = async (
  teamId,
  researchOutput,
  authorization,
) => {
  const resp = await fetch(`${API_BASE_URL}/research-outputs`, {
    method: 'POST',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify({
      ...researchOutput,
      teamId,
    }),
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to create research output for teamId: ${teamId} Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
