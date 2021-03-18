import React from 'react';

import { SearchField } from '../molecules';

interface EventSearchProps {
  searchQuery?: string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
}
const EventSearch: React.FC<EventSearchProps> = ({
  searchQuery,
  onChangeSearchQuery,
}) =>
  searchQuery === undefined ? null : (
    <SearchField
      placeholder="Search by topic, presenting team, …"
      value={searchQuery}
      onChange={onChangeSearchQuery}
    />
  );

export default EventSearch;
