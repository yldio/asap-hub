import { ComponentProps } from 'react';
import { SearchField } from '../molecules';

type EventSearchProps = {
  searchQuery?: ComponentProps<typeof SearchField>['value'];
  onChangeSearchQuery?: ComponentProps<typeof SearchField>['onChange'];
};
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
