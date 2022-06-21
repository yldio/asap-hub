import { SearchFrame } from '@asap-hub/frontend-utils';
import { EventSearch, EventsList } from '@asap-hub/react-components';
import { getEventListOptions } from '../../events/options';
import { useEvents } from '../../events/state';
import { usePagination, usePaginationParams, useSearch } from '../../hooks';

type EventsProps = {
  readonly currentTime: Date;
  readonly past: boolean;
  readonly userId: string;
};
const Events: React.FC<EventsProps> = ({ currentTime, userId, past }) => {
  const { searchQuery, setSearchQuery, debouncedSearchQuery } = useSearch();

  return (
    <article>
      <EventSearch
        searchQuery={searchQuery}
        onChangeSearchQuery={setSearchQuery}
      />
      <SearchFrame title="">
        <EventsDisplay
          searchQuery={debouncedSearchQuery}
          past={past}
          userId={userId}
          currentTime={currentTime}
        />
      </SearchFrame>
    </article>
  );
};

type EventsDisplayProps = EventsProps & {
  searchQuery: string;
};
const EventsDisplay: React.FC<EventsDisplayProps> = ({
  currentTime,
  past,
  searchQuery,
  userId,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { items, total } = useEvents(
    getEventListOptions(
      currentTime,
      past,
      {
        searchQuery,
        currentPage,
        pageSize,
      },
      userId,
    ),
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

export default Events;
