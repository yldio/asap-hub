import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  EventConstraint,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';
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
    constraint?: EventConstraint;
  };

export const getEventListOptions = (
  currentTime: Date,
  past: boolean,
  { searchQuery = '', currentPage = 0, pageSize = CARD_VIEW_PAGE_SIZE } = {},
  constraint?: EventConstraint,
): GetEventListOptions => {
  const time = subHours(
    currentTime,
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  ).toISOString();

  return {
    searchQuery,
    currentPage,
    constraint,
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
