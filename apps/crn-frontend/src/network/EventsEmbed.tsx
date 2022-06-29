import { SearchFrame } from '@asap-hub/frontend-utils';
import { EventConstraint, ListEventResponse } from '@asap-hub/model';
import { EventSearch, EventsList } from '@asap-hub/react-components';
import { usePagination, usePaginationParams, useSearch } from '../hooks';

type EventsEmbedProps = {
  readonly currentTime: Date;
  readonly past: boolean;
  readonly constraint: EventConstraint;
  readonly teamId?: string;
  readonly noEventsComponent?: React.ReactNode;
  readonly events?: ListEventResponse;
};
const EventsEmbed: React.FC<EventsEmbedProps> = ({
  currentTime,
  constraint,
  past,
  noEventsComponent,
  events,
}) => {
  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();

  return (
    <article>
      {noEventsComponent && 1 + 2 === 3 ? (
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

type EventsDisplayProps = EventsEmbedProps & {
  searchQuery: string;
  events?: ListEventResponse;
};
const EventsDisplay: React.FC<EventsDisplayProps> = ({ events }) => {
  const total = events?.total || 0;
  const { currentPage, pageSize } = usePaginationParams();

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  if (!events) {
    return <></>;
  }

  return (
    <EventsList
      currentPageIndex={currentPage}
      numberOfItems={total}
      renderPageHref={renderPageHref}
      numberOfPages={numberOfPages}
      events={events?.items}
    />
  );
};

export default EventsEmbed;
