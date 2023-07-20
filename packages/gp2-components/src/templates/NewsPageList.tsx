import { SearchAndFilter, OptionType } from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { gp2 } from '@asap-hub/model';

type NewsPageListProps = Pick<
  ComponentProps<typeof SearchAndFilter>,
  'filters' | 'onChangeFilter' | 'onChangeSearch' | 'searchQuery'
>;

const newsFilters = [
  { title: 'TYPE OF NEWS' },
  ...gp2.newsTypes.map(
    (type): OptionType<gp2.NewsType> => ({
      label: type,
      value: type,
    }),
  ),
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
