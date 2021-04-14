import {
  ResearchOutputResponse,
  ListResearchOutputResponse,
} from '@asap-hub/model';

import { createListApiUrl, GetListOptions } from '../api-util';
import { API_BASE_URL } from '../config';

export const getResearchOutput = async (
  id: string,
  authorization: string,
): Promise<ResearchOutputResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/research-outputs/${id}`, {
    headers: { authorization },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch research output with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getResearchOutputs = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListResearchOutputResponse> => {
  const resp = await fetch(
    createListApiUrl('research-outputs', options).toString(),
    {
      headers: { authorization },
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch research output list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
