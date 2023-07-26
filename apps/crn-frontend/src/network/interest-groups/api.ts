import {
  ListInterestGroupResponse,
  InterestGroupResponse,
} from '@asap-hub/model';
import {
  GetListOptions,
  createSentryHeaders,
  createFeatureFlagHeaders,
} from '@asap-hub/frontend-utils';
import { API_BASE_URL } from '../../config';
import createListApiUrl from '../../CreateListApiUrl';

export const getInterestGroups = async (
  options: GetListOptions,
  authorization: string,
): Promise<ListInterestGroupResponse> => {
  const resp = await fetch(
    createListApiUrl('interest-groups', options).toString(),
    {
      headers: {
        authorization,
        ...createSentryHeaders(),
        ...createFeatureFlagHeaders(),
      },
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch group list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
export const getInterestGroup = async (
  id: string,
  authorization: string,
): Promise<InterestGroupResponse | undefined> => {
  const resp = await fetch(`${API_BASE_URL}/interest-groups/${id}`, {
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
      `Failed to fetch group with id ${id}. Expected status 2xx or 404. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
