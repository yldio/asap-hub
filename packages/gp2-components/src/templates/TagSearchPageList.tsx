import { gp2 as gp2Model } from '@asap-hub/model';
import { SearchAndFilter } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

type TagSearchPageListProps = {
  hasResults: boolean;
} & Pick<
  ComponentProps<typeof SearchAndFilter>,
  'filters' | 'onChangeFilter' | 'onChangeSearch' | 'searchQuery'
>;

interface Option<V extends string> {
  value: V;
  label: string;
  enabled?: boolean;
}
interface Title {
  title: string;
  label?: undefined;
}

const outputFilters: ReadonlyArray<Option<gp2Model.EntityType> | Title> = [
  { title: 'AREAS' },
  { value: 'output', label: 'Outputs' },
  { value: 'event', label: 'Events' },
  { value: 'user', label: 'People' },
  { value: 'project', label: 'Projects' },
];

const TagSearchPageList: React.FC<TagSearchPageListProps> = ({
  children,
  filters,
  onChangeFilter,
  onChangeSearch,
  searchQuery,
  hasResults,
}) => (
  <>
    {hasResults && (
      <SearchAndFilter
        onChangeSearch={onChangeSearch}
        searchPlaceholder="Search for any tags..."
        searchQuery={searchQuery}
        onChangeFilter={onChangeFilter}
        filterOptions={outputFilters}
        filters={filters}
      />
    )}
    <main>{children}</main>
  </>
);

export default TagSearchPageList;
