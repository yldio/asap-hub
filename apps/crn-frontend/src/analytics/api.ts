import { createSentryHeaders, GetListOptions } from '@asap-hub/frontend-utils';
import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';
import createListApiUrl from '../CreateListApiUrl';

export const getAnalyticsLeadership = async (
  options: Pick<GetListOptions, 'currentPage' | 'pageSize'>,
  authorization: string,
): Promise<ListAnalyticsTeamLeadershipResponse | undefined> => {
  const { currentPage, pageSize } = options;
  const resp = await fetch(
    createListApiUrl('/analytics/team-leadership', {
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
      `Failed to fetch analytics team leadership list. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
    );
  }
  return resp.json();
};
