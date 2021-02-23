import React from 'react';
import { EventsUpcoming } from '@asap-hub/react-components';

import { useEvents } from './state';
import { usePagination, usePaginationParams } from '../hooks';

type UpcomingProps = {
  time: string;
};
const Upcoming: React.FC<UpcomingProps> = ({ time }) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items, total } = useEvents({
    before: time,
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
        groups: event.groups.map((group) => ({ ...group, href: '' })),
        href: '',
      }))}
    />
  );
};

export default Upcoming;
