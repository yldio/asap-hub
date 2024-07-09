import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import { ListEngagementResponse } from '@asap-hub/model';

import createListApiUrl from '../../CreateListApiUrl';

export const getEngagement = async (
  options: Pick<GetListOptions, 'currentPage' | 'pageSize'>,
  authorization: string,
): Promise<ListEngagementResponse | undefined> => {
  const { currentPage, pageSize } = options;
  const resp = await fetch(
    createListApiUrl('/analytics/engagement', {
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
      `Failed to fetch analytics engagement. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
