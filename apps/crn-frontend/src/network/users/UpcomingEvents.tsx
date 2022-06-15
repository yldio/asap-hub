import { EventsList } from '@asap-hub/react-components';
import { getEventListOptions } from '../../events/options';
import { useEvents } from '../../events/state';
import { usePagination, usePaginationParams } from '../../hooks';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;
  readonly searchQuery: string;
  readonly userId: string;
};
const EventList: React.FC<EventListProps> = ({
  currentTime,
  past = false,
  searchQuery = '',
  userId = '2a854c5a-184f-40ff-9615-bc6ca72b6470',
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  // speaker id 2a854c5a-184f-40ff-9615-bc6ca72b6470
  const { items, total } = useEvents(
    getEventListOptions(currentTime, past, userId, {
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
