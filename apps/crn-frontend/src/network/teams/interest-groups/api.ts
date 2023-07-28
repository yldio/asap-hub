import { ListInterestGroupResponse } from '@asap-hub/model';
import {
  createSentryHeaders,
  createFeatureFlagHeaders,
} from '@asap-hub/frontend-utils';

import { API_BASE_URL } from '../../../config';

export const getTeamInterestGroups = async (
  id: string,
  authorization: string,
): Promise<ListInterestGroupResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/teams/${id}/interest-groups`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
      ...createFeatureFlagHeaders(),
    },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch team groups with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
