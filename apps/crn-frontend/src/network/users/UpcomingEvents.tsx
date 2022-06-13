import { EventsList } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../../hooks';
import { getEventListOptions } from './options';
import { useEvents, usePrefetchEvents } from './state';

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
    getEventListOptions(currentTime, past, {
      searchQuery,
      currentPage,
      pageSize,
    }),
  );

  usePrefetchEvents(
    getEventListOptions(currentTime, !past, {
      searchQuery,
      currentPage,
      pageSize,
    }),
  );

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
