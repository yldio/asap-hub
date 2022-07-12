import { EventsList } from '@asap-hub/react-components';
import { network, useRouteParams } from '@asap-hub/routing';

import { useGroupEvents, usePrefetchGroupEvents } from './state';
import { usePaginationParams, usePagination } from '../../../hooks';
import { getEventListOptions } from '../../../events/options';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;

  readonly searchQuery: string;
  readonly noEventsComponent?: React.ReactNode;
};

const EventList: React.FC<EventListProps> = ({
  currentTime,
  past = false,
  searchQuery = '',
  noEventsComponent,
}) => {
  const groupRoute = network({}).groups({}).group;
  const { groupId } = useRouteParams(groupRoute);
  const { currentPage, pageSize } = usePaginationParams();

  const events = useGroupEvents(
    groupId,
    getEventListOptions(currentTime, {
      past,
      searchQuery,
      pageSize,
      currentPage,
    }),
  );

  if (events === 'noSuchGroup') {
    throw new Error(
      `Failed to fetch events for group with id ${groupId}. Group does not exist.`,
    );
  }

  usePrefetchGroupEvents(
    groupId,
    getEventListOptions(currentTime, {
      past: false,
      searchQuery,
      pageSize,
      currentPage,
    }),
  );

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
      noEventsComponent={noEventsComponent}
    />
  );
};

export default EventList;
