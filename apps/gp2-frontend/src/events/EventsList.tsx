import { getEventListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { EventsList } from '@asap-hub/react-components';
import { usePagination, usePaginationParams } from '../hooks/pagination';
import { useEvents } from './state';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;
};

export const eventMapper = ({ speakers, ...event }: gp2.EventResponse) => ({
  ...event,
  hasSpeakersToBeAnnounced: speakers.length === 0,
  eventOwner: <div>GP2 Team</div>,
});

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
      events={items.map(eventMapper)}
    />
  );
};

export default EventList;
