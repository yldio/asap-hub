import { ListInterestGroupResponse } from '@asap-hub/model';
import { createSentryHeaders } from '@asap-hub/frontend-utils';

import { API_BASE_URL } from '../../../config';

export const getUserInterestGroups = async (
  id: string,
  authorization: string,
): Promise<ListInterestGroupResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/users/${id}/interest-groups`, {
    headers: {
      authorization,
      ...createSentryHeaders(),
    },
  });
  if (!resp.ok) {
    if (resp.status === 404) {
      return undefined;
    }
    throw new Error(
      `Failed to fetch groups for user with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
