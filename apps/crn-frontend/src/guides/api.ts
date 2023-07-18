import { ListGuideResponse } from '@asap-hub/model';
import {
  createSentryHeaders,
  createFeatureFlagHeaders,
} from '@asap-hub/frontend-utils';
import { API_BASE_URL } from '../config';

export const getGuides = async (
  authorization: string,
): Promise<ListGuideResponse> => {
  const resp = await fetch(`${API_BASE_URL}/guides`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
      ...createFeatureFlagHeaders(),
    },
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch guides. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
