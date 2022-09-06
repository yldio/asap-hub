import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getProjects = async (
  authorization: string,
): Promise<gp2.ListProjectResponse> => {
  const resp = await fetch(`${API_BASE_URL}/projects`, {
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
