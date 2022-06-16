import { EventResponse } from '@asap-hub/model';
import { EventsList } from '@asap-hub/react-components';
import { usePagination } from '../../hooks';

type EventListProps = {
  // readonly currentTime: Date;
  // readonly past?: boolean;
  // readonly searchQuery: string;
  // readonly userId: string;
  readonly events: EventResponse[];
  currentPage: number;
  pageSize: number;
  total: number;
};
const EventList: React.FC<EventListProps> = ({
  currentPage,
  pageSize,
  events,
  total,
}) => {
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <EventsList
      currentPageIndex={currentPage}
      numberOfItems={total}
      renderPageHref={renderPageHref}
      numberOfPages={numberOfPages}
      events={events}
    />
  );
};

export default EventList;
