import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import {
  ListTeamProductivityResponse,
  ListUserProductivityResponse,
} from '@asap-hub/model';

import createListApiUrl from '../../CreateListApiUrl';

export const getUserProductivity = async (
  options: Pick<GetListOptions, 'currentPage' | 'pageSize'>,
  authorization: string,
): Promise<ListUserProductivityResponse | undefined> => {
  const { currentPage, pageSize } = options;
  const resp = await fetch(
    createListApiUrl('/analytics/productivity/user', {
      currentPage,
      pageSize,
      filters: new Set(),
      searchQuery: '',
    }).toString(),
    {
      headers: {
        authorization,
        ...createSentryHeaders(),
      },
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch analytics user productivity. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};

export const getTeamProductivity = async (
  options: Pick<GetListOptions, 'currentPage' | 'pageSize'>,
  authorization: string,
): Promise<ListTeamProductivityResponse | undefined> => {
  const { currentPage, pageSize } = options;
  const resp = await fetch(
    createListApiUrl('/analytics/productivity/team', {
      currentPage,
      pageSize,
      filters: new Set(),
      searchQuery: '',
    }).toString(),
    {
      headers: {
        authorization,
        ...createSentryHeaders(),
      },
    },
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch analytics team productivity. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
