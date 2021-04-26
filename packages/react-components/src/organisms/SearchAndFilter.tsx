import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { SearchField } from '../molecules';
import { perRem } from '../pixels';
import { noop } from '../utils';
import { Filter } from '.';

const styles = css({
  display: 'grid',
  gridTemplateColumns: 'auto min-content',
  gridColumnGap: `${18 / perRem}em`,
  alignItems: 'center',
});

type SearchFieldProps = ComponentProps<typeof SearchField>;
type SearchAndFilterProps = ComponentProps<typeof Filter> & {
  readonly searchQuery: SearchFieldProps['value'];
  readonly onChangeSearch: SearchFieldProps['onChange'];
  readonly searchPlaceholder: SearchFieldProps['placeholder'];
};

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onChangeSearch = noop,
  searchPlaceholder,

  filters,
  onChangeFilter,
  filterOptions,
  filterTitle,
}) => (
  <div role="search" css={styles}>
    <SearchField
      value={searchQuery}
      placeholder={searchPlaceholder}
      onChange={onChangeSearch}
    />
    <Filter
      filters={filters}
      onChangeFilter={onChangeFilter}
      filterOptions={filterOptions}
      filterTitle={filterTitle}
    />
  </div>
);

export default SearchAndFilter;
