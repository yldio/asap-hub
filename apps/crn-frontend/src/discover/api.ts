import { DiscoverResponse } from '@asap-hub/model';
import { createSentryHeaders } from '../api-util';
import { API_BASE_URL } from '../config';

export const getDiscover = async (
  authorization: string,
): Promise<DiscoverResponse> => {
  const resp = await fetch(`${API_BASE_URL}/discover`, {
    headers: { authorization, ...createSentryHeaders() },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch discover. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
