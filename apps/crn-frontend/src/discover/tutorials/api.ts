import { TutorialsResponse } from '@asap-hub/model';
import { createFeatureFlagHeaders } from '@asap-hub/frontend-utils';
import { API_BASE_URL } from '../../config';

export const getTutorialById = async (
  id: string,
  authorization: string,
): Promise<TutorialsResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/tutorials/${id}`, {
    headers: { authorization, ...createFeatureFlagHeaders() },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch tutorial with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
