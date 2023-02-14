import {
  EventConstraint,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';
import { subHours } from 'date-fns';
import { GetListOptions } from '../api-util';

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

export type EventListParams = {
  past: boolean;
  searchQuery?: string;
  currentPage?: number;
  pageSize?: number;
  constraint?: EventConstraint;
};

export const getEventListOptions = (
  currentTime: Date,
  {
    past,
    searchQuery = '',
    currentPage = 0,
    pageSize = 10,
    constraint = {},
  }: EventListParams,
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
