import { EventsList } from '@asap-hub/react-components';

import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useEvents } from './state';
import { getEventListOptions } from './options';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;
};
const EventList: React.FC<EventListProps> = ({ currentTime, past = false }) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items, total } = useEvents(
    getEventListOptions(currentTime, {
      past,
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
