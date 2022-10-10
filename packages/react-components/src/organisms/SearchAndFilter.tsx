import React, { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { SearchField } from '../molecules';
import { perRem } from '../pixels';
import { noop } from '../utils';
import { Filter } from '.';
import { Option } from '../select';

const styles = css({
  display: 'grid',
  gridTemplateColumns: 'auto min-content',
  gridColumnGap: `${18 / perRem}em`,
  alignItems: 'center',
});

type SearchFieldProps = ComponentProps<typeof SearchField>;
interface SearchAndFilterProps<V extends string> {
  readonly filters?: Set<V>;
  readonly onChangeFilter?: (filter: V) => void;
  readonly filterOptions: Option<V>[];

  readonly searchQuery: SearchFieldProps['value'];
  readonly onChangeSearch: SearchFieldProps['onChange'];
  readonly searchPlaceholder: SearchFieldProps['placeholder'];
}

export default function SearchAndFilter<V extends string>({
  searchQuery,
  onChangeSearch = noop,
  searchPlaceholder,

  filters,
  onChangeFilter,
  filterOptions,
}: SearchAndFilterProps<V>): ReturnType<React.FC> {
  return (
    <div role="search" css={styles}>
      <SearchField
        value={searchQuery}
        placeholder={searchPlaceholder}
        onChange={onChangeSearch}
      />
      <Filter<V>
        filters={filters}
        onChangeFilter={onChangeFilter}
        filterOptions={filterOptions}
      />
    </div>
  );
}
