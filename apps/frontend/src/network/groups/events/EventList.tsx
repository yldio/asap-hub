import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { subHours } from 'date-fns';
import { EventsList } from '@asap-hub/react-components';
import { EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT } from '@asap-hub/model';

import { useGroupEvents } from './state';
import { usePaginationParams, usePagination } from '../../../hooks';
import { NETWORK_PATH, EVENTS_PATH } from '../../../routes';
import { GROUPS_PATH } from '../../routes';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;
};
const EventList: React.FC<EventListProps> = ({ currentTime, past }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const {
    params: { id },
  } = useRouteMatch<{ id: string }>();

  const time = subHours(
    currentTime,
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  ).toISOString();

  const { items, total } = useGroupEvents(id, {
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
      events={items.map((event) => ({
        ...event,
        groups: event.groups.map((group) => ({
          ...group,
          href: `${NETWORK_PATH}/${GROUPS_PATH}/${group.id}`,
        })),
        href: `${EVENTS_PATH}/${event.id}`,
      }))}
    />
  );
};

export default EventList;
