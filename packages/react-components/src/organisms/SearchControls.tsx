import React from 'react';
import css from '@emotion/css';

import { Button } from '../atoms';
import { SearchField } from '../molecules';
import { filterIcon } from '../icons';
import { perRem, tabletScreen } from '../pixels';
import { noop } from '../utils';

const searchContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto min-content',
  gridColumnGap: `${18 / perRem}em`,
  alignItems: 'center',
});

const buttonTextStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

interface SearchControlsProps {
  query: string;
  onChangeSearch?: (newQuery: string) => void;
  placeholder: string;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  query,
  onChangeSearch = noop,
  placeholder,
}) => (
  <div css={searchContainerStyles}>
    <SearchField
      value={query}
      placeholder={placeholder}
      onChange={onChangeSearch}
    />
    <Button enabled={false} onClick={() => undefined}>
      {filterIcon}
      <span css={buttonTextStyles}>Filters</span>
    </Button>
  </div>
);

export default SearchControls;
