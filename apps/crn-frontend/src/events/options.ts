import { GetListOptions } from '@asap-hub/frontend-utils';
import { EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT } from '@asap-hub/model';
import { subHours } from 'date-fns';
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
  ) & {
    userId?: string;
    teamId?: string;
  };

export const getEventListOptions = (
  currentTime: Date,
  past: boolean,
  { searchQuery = '', currentPage = 0, pageSize = CARD_VIEW_PAGE_SIZE } = {},
  { userId, teamId }: { userId?: string; teamId?: string } = {},
): GetEventListOptions => {
  const time = subHours(
    currentTime,
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  ).toISOString();

  return {
    searchQuery,
    currentPage,
    userId,
    teamId,
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
