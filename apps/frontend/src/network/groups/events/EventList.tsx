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
};
const EventList: React.FC<EventListProps> = ({ currentTime, past }) => {
  const groupRoute = network({}).groups({}).group;
  const { groupId } = useRouteParams(groupRoute);
  const { currentPage, pageSize } = usePaginationParams();

  const time = subHours(
    currentTime,
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  ).toISOString();

  const { items, total } = useGroupEvents(groupId, {
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

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <EventsList
      currentPageIndex={currentPage}
      numberOfItems={total}
      renderPageHref={renderPageHref}
      numberOfPages={numberOfPages}
      events={items}
    />
  );
};

export default EventList;
