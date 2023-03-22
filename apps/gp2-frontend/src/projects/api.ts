import {
  BackendError,
  createSentryHeaders,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';
import CreateListApiUrl from '../CreateListApiUrl';

export const getProjects = async (
  authorization: string,
  options: GetListOptions,
): Promise<gp2.ListProjectResponse> => {
  const resp = await fetch(CreateListApiUrl('projects', options), {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the projects. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getProject = async (
  id: string,
  authorization: string,
): Promise<gp2.ProjectResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/project/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch project with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const putProjectResources = async (
  id: string,
  payload: gp2.ProjectResourcesPutRequest,
  authorization: string,
): Promise<gp2.ProjectResponse> => {
  const resp = await fetch(`${API_BASE_URL}/project/${id}/resources`, {
    method: 'PUT',
    headers: {
      authorization,
      'content-type': 'application/json',
      ...createSentryHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const response = await resp.json();
  if (!resp.ok) {
    throw new BackendError(
      `Failed to update project resources for id ${id} Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};
