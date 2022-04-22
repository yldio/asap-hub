import { subHours } from 'date-fns';
import { EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT } from '@asap-hub/model';

import { GetListOptions } from '@asap-hub/frontend-utils';
import { CARD_VIEW_PAGE_SIZE } from '../hooks';

export type GetEventListOptions = GetListOptions &
  (
    | {
        before: string;
        after?: undefined;
        sort: { sortBy: 'endDate'; sortOrder: 'desc' };
      }
    | {
        after: string;
        before?: undefined;
        sort?: undefined;
      }
  );

export const getEventListOptions = (
  currentTime: Date,
  past: boolean,
  { searchQuery = '', currentPage = 0, pageSize = CARD_VIEW_PAGE_SIZE } = {},
): GetEventListOptions => {
  const time = subHours(
    currentTime,
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  ).toISOString();

  return {
    searchQuery,
    currentPage,
    pageSize,
    filters: new Set(),
    ...(past
      ? {
          before: time,
          sort: {
            sortBy: 'endDate',
            sortOrder: 'desc' as const,
          },
        }
      : { after: time }),
  };
};
