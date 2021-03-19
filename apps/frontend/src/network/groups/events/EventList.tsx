import React from 'react';
import { subHours } from 'date-fns';
import { EventsList } from '@asap-hub/react-components';
import { EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT } from '@asap-hub/model';
import { network, useRouteParams } from '@asap-hub/routing';

import { useGroupEvents } from './state';
import { usePaginationParams, usePagination } from '../../../hooks';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;

  readonly searchQuery: string;
};
const EventList: React.FC<EventListProps> = ({
  currentTime,
  past,
  searchQuery,
}) => {
  const groupRoute = network({}).groups({}).group;
  const { groupId } = useRouteParams(groupRoute);
  const { currentPage, pageSize } = usePaginationParams();

  const time = subHours(
    currentTime,
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  ).toISOString();

  const events = useGroupEvents(groupId, {
    searchQuery,
    ...(past
      ? {
          before: time,
          sort: {
            sortBy: 'endDate',
            sortOrder: 'desc' as const,
          },
        }
      : {
          after: time,
        }),
    currentPage,
    pageSize,
  });

  if (events === 'noSuchGroup') {
    throw new Error(
      `Failed to fetch events for group with id ${groupId}. Group does not exist.`,
    );
  }

  const { numberOfPages, renderPageHref } = usePagination(
    events.total,
    pageSize,
  );
  return (
    <EventsList
      currentPageIndex={currentPage}
      numberOfItems={events.total}
      renderPageHref={renderPageHref}
      numberOfPages={numberOfPages}
      events={events.items}
    />
  );
};

export default EventList;
