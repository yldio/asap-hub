import { EventsList } from '@asap-hub/react-components';
import { getEventListOptions } from '@asap-hub/frontend-utils';

import { useEvents, usePrefetchEvents } from './state';
import { usePagination, usePaginationParams } from '../hooks';
import { usePrefetchCalendars } from './calendar/state';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;

  readonly searchQuery: string;
};
const EventList: React.FC<EventListProps> = ({
  currentTime,
  past = false,
  searchQuery = '',
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items, total } = useEvents(
    getEventListOptions(currentTime, {
      past,
      searchQuery,
      currentPage,
      pageSize,
    }),
  );

  usePrefetchEvents(
    getEventListOptions(currentTime, {
      past: false,
      searchQuery,
      currentPage,
      pageSize,
    }),
  );
  usePrefetchCalendars();

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
