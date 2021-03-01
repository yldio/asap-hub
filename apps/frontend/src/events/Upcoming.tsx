import React from 'react';
import { EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT } from '@asap-hub/model';
import { EventsUpcoming } from '@asap-hub/react-components';
import addHours from 'date-fns/addHours';

import { useEvents } from './state';
import { usePagination, usePaginationParams } from '../hooks';
import { NETWORK_PATH, EVENTS_PATH } from '../routes';
import { GROUPS_PATH } from '../network/routes';

type UpcomingProps = {
  readonly currentTime: Date;
};
const Upcoming: React.FC<UpcomingProps> = ({ currentTime }) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items, total } = useEvents({
    after: addHours(
      currentTime,
      EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
    ).toISOString(),
    currentPage,
    pageSize,
  });
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <EventsUpcoming
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

export default Upcoming;
