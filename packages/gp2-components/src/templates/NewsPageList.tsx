import { SearchAndFilter } from '@asap-hub/react-components';
import { ComponentProps } from 'react';

type NewsPageListProps = Pick<
  ComponentProps<typeof SearchAndFilter>,
  'filters' | 'onChangeFilter' | 'onChangeSearch' | 'searchQuery'
>;

type Option<V extends string> = {
  value: V;
  label: string;
  enabled?: boolean;
};
type Title = {
  title: string;
  label?: undefined;
};

const newsFilters: ReadonlyArray<Option<'news' | 'update'> | Title> = [
  { title: 'TYPE OF NEWS' },
  { label: 'Newsletters', value: 'news' },
  { label: 'Updates', value: 'update' },
];

const NewsPageList: React.FC<NewsPageListProps> = ({
  children,
  filters,
  onChangeFilter,
  onChangeSearch,
  searchQuery,
}) => (
  <>
    <SearchAndFilter
      onChangeSearch={onChangeSearch}
      searchPlaceholder="Enter name..."
      searchQuery={searchQuery}
      onChangeFilter={onChangeFilter}
      filterOptions={newsFilters}
      filters={filters}
    />
    <main>{children}</main>
  </>
);

export default NewsPageList;
