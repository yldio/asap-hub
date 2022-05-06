import { PageResponse } from '@asap-hub/model';
import { createSentryHeaders } from '../api-util';
import { API_BASE_URL } from '../config';

export const getPageByPath = async (
  path: string,
): Promise<PageResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/pages/${path}`, {
    headers: createSentryHeaders(),
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch page with path ${path}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
