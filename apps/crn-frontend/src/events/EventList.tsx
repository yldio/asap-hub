import {
  EventsList,
  EventOwner,
  EventTeams,
  EventNumberOfSpeakers,
} from '@asap-hub/react-components';
import { EventResponse } from '@asap-hub/model';
import { getEventListOptions } from '@asap-hub/frontend-utils';

import { useEvents, usePrefetchEvents } from './state';
import { usePagination, usePaginationParams } from '../hooks';
import { usePrefetchCalendars } from './calendar/state';

type EventListProps = {
  readonly currentTime: Date;
  readonly past?: boolean;

  readonly searchQuery: string;
};

export const eventMapper = ({
  speakers,
  interestGroup,
  workingGroup,
  ...event
}: EventResponse) => ({
  ...event,
  hasSpeakersToBeAnnounced: !!(
    speakers.length === 0 ||
    speakers.find((speaker) => 'team' in speaker && !('user' in speaker))
  ),
  eventTeams: <EventTeams speakers={speakers} />,
  eventSpeakers: <EventNumberOfSpeakers speakers={speakers} />,
  eventOwner: (
    <EventOwner interestGroup={interestGroup} workingGroup={workingGroup} />
  ),
});

const EventList: React.FC<EventListProps> = ({
  currentTime,
  past = false,
  searchQuery = '',
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const { items, total, algoliaIndexName, algoliaQueryId } = useEvents(
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
      algoliaIndexName={algoliaIndexName}
      algoliaQueryId={algoliaQueryId}
      currentPageIndex={currentPage}
      numberOfItems={total}
      renderPageHref={renderPageHref}
      numberOfPages={numberOfPages}
      events={items.map(eventMapper)}
    />
  );
};

export default EventList;
