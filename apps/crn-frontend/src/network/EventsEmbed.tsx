import { SearchFrame } from '@asap-hub/frontend-utils';
import { EventSearch, EventsList } from '@asap-hub/react-components';
import { getEventListOptions } from '../events/options';
import { useEvents } from '../events/state';
import { usePagination, usePaginationParams, useSearch } from '../hooks';

type EventsEmbedProps = {
  readonly currentTime: Date;
  readonly past: boolean;
  readonly userId?: string;
  readonly teamId?: string;
};
const EventsEmbed: React.FC<EventsEmbedProps> = ({
  currentTime,
  userId,
  teamId,
  past,
}) => {
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
          teamId={teamId}
          currentTime={currentTime}
        />
      </SearchFrame>
    </article>
  );
};

type EventsDisplayProps = EventsEmbedProps & {
  searchQuery: string;
};
const EventsDisplay: React.FC<EventsDisplayProps> = ({
  currentTime,
  past,
  searchQuery,
  userId,
  teamId,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const options = getEventListOptions(
    currentTime,
    past,
    {
      searchQuery,
      currentPage,
      pageSize,
    },
    { userId, teamId },
  );
  const { items, total } = useEvents(options);
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

export default EventsEmbed;
