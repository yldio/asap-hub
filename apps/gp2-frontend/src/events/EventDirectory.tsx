import { SearchFrame } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { SearchAndFilter } from '@asap-hub/react-components';
import { useSearch } from '../hooks/search';

import EventsList from './EventsList';

type EventDirectoryProps = {
  readonly currentTime: Date;
  readonly past?: boolean;
  constraint?: gp2.EventConstraint;
  paddingTop?: number;
};

const eventFilters = [
  { title: 'TYPE OF OUTPUT' },
  ...[gp2.eventWorkingGroups, gp2.eventProjects, gp2.eventGP2Hub].map(
    (value) => ({ label: value, value }),
  ),
];

const EventDirectory: React.FC<EventDirectoryProps> = ({
  currentTime,
  past = false,
  constraint,
  paddingTop,
}) => {
  const {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
  } = useSearch(['eventType']);

  const filterSet = new Set<string>(filters.eventType);
  const onChangeFilter = (filter: string) => {
    toggleFilter(filter, 'eventType');
  };

  return (
    <>
      <SearchAndFilter
        searchQuery={searchQuery}
        filterOptions={eventFilters}
        filters={filterSet}
        onChangeFilter={onChangeFilter}
        searchPlaceholder="Enter event name, working group or project name..."
        onChangeSearch={setSearchQuery}
      />
      <SearchFrame title={`${past ? 'Past' : 'Upcoming'} Events`}>
        <EventsList
          currentTime={currentTime}
          past={past}
          constraint={constraint}
          searchQuery={debouncedSearchQuery}
          filters={filterSet}
          paddingTop={paddingTop}
          eventType={filters.eventType}
        />
      </SearchFrame>
    </>
  );
};

export default EventDirectory;
