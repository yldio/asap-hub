import { BackendError, createSentryHeaders } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getWorkingGroups = async (
  authorization: string,
): Promise<gp2.ListWorkingGroupNetworkResponse> => {
  const resp = await fetch(`${API_BASE_URL}/working-group-network`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the working groups. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getWorkingGroup = async (
  id: string,
  authorization: string,
): Promise<gp2.WorkingGroupResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/working-group/${id}`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch working group with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const putWorkingGroupResources = async (
  id: string,
  payload: gp2.WorkingGroupResourcesPutRequest,
  authorization: string,
): Promise<gp2.WorkingGroupResponse> => {
  const resp = await fetch(`${API_BASE_URL}/working-group/${id}/resources`, {
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
      `Failed to update working group resources for id ${id} Expected status 200. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      response,
      resp.status,
    );
  }
  return response;
};
