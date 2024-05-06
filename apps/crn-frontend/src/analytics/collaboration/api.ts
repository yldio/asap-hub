import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import { TimeRangeOption } from '@asap-hub/model';

import createListApiUrl from '../../CreateListApiUrl';

export type CollaborationListOptions = Pick<
  GetListOptions,
  'currentPage' | 'pageSize'
> & {
  timeRange: TimeRangeOption;
};

export const getUserCollaboration = async (
  options: CollaborationListOptions,
  authorization: string,
) => {
  const { currentPage, pageSize, timeRange } = options;
  const resp = await fetch(
    createListApiUrl('/analytics/collaboration/user', {
      currentPage,
      pageSize,
      filters: new Set([timeRange]),
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
      `Failed to fetch analytics user collaboration. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
