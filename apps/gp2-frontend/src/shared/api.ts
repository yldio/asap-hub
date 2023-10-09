import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { API_BASE_URL } from '../config';

export const getTags = async (
  authorization: string,
): Promise<gp2.ListTagsResponse> => {
  const resp = await fetch(`${API_BASE_URL}/tags`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch the Tags. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
