import {
  BackendError,
  createSentryHeaders,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import {
  ListLabsResponse,
  ListTeamResponse,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { isResearchOutputWorkingGroupRequest } from '@asap-hub/validation';
import { API_BASE_URL } from '../../config';
import createListApiUrl from '../../CreateListApiUrl';

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

export const createResearchOutput = async (
  researchOutput: ResearchOutputPostRequest,
  authorization: string,
  publish: boolean = true,
): Promise<ResearchOutputResponse> => {
  const resp = await fetch(
    `${API_BASE_URL}/research-outputs?publish=${publish}`,
    {
      method: 'POST',
      headers: {
        authorization,
        'content-type': 'application/json',
        ...createSentryHeaders(),
      },
      body: JSON.stringify(researchOutput),
    },
  );
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to create research output for ${
        isResearchOutputWorkingGroupRequest(researchOutput)
          ? 'Working Group'
          : 'Team'
      }. Expected status 201. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const updateTeamResearchOutput = async (
  researchOutputId: string,
  researchOutput: ResearchOutputPostRequest,
  authorization: string,
  publish: boolean = true,
): Promise<ResearchOutputResponse> => {
  const resp = await fetch(
    `${API_BASE_URL}/research-outputs/${researchOutputId}?publish=${publish}`,
    {
      method: 'PUT',
      headers: {
        authorization,
        'content-type': 'application/json',
        ...createSentryHeaders(),
      },
      body: JSON.stringify(researchOutput),
    },
  );
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to update research output for teams ${
        researchOutput.teams
      } Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};

export const getLabs = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListLabsResponse> => {
  const resp = await fetch(createListApiUrl('labs', options).toString(), {
    method: 'GET',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch labs. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
