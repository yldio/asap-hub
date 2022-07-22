import { SearchFrame } from '@asap-hub/frontend-utils';
import { EventConstraint, ListEventResponse } from '@asap-hub/model';
import { EventSearch, EventsList } from '@asap-hub/react-components';
import { usePagination, usePaginationParams, useSearch } from '../hooks';
import { useEvents } from '../events/state';
import { getEventListOptions } from '../events/options';

type EventsEmbedListProps = {
  readonly currentTime: Date;
  readonly past: boolean;
  readonly constraint: EventConstraint;
  readonly teamId?: string;
  readonly noEventsComponent?: React.ReactNode;
  readonly events?: ListEventResponse;
};

const EventsEmbedList: React.FC<EventsEmbedListProps> = ({
  currentTime,
  constraint,
  past,
  noEventsComponent,
}) => {
  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();
  const { pageSize } = usePaginationParams();

  const eventOptions = getEventListOptions(currentTime, {
    past,
    pageSize,
    constraint,
  });

  const events = useEvents(eventOptions);

  const hasEvents = events?.total;

  return (
    <article>
      {noEventsComponent && !hasEvents ? (
        noEventsComponent
      ) : (
        <>
          <EventSearch
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
          />
          <SearchFrame title="">
            <EventsDisplay
              searchQuery={debouncedSearchQuery}
              past={past}
              constraint={constraint}
              currentTime={currentTime}
              events={events}
            />
          </SearchFrame>
        </>
      )}
    </article>
  );
};

type EventsDisplayProps = EventsEmbedListProps & {
  searchQuery: string;
  events?: ListEventResponse;
};

const EventsDisplay: React.FC<EventsDisplayProps> = ({
  currentTime,
  past,
  searchQuery,
  constraint,
  noEventsComponent,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const options = getEventListOptions(currentTime, {
    past,
    searchQuery,
    currentPage,
    pageSize,
    constraint,
  });

  const { items, total } = useEvents(options);
  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <EventsList
      currentPageIndex={currentPage}
      numberOfItems={total}
      renderPageHref={renderPageHref}
      numberOfPages={numberOfPages}
      events={items}
      noEventsComponent={noEventsComponent}
    />
  );
};

export default EventsEmbedList;
