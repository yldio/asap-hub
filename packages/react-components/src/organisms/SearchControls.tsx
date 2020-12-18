import React, { useState, useEffect } from 'react';
import css from '@emotion/css';

import { Button, Caption } from '../atoms';
import { SearchField } from '../molecules';
import { filterIcon } from '../icons';
import {
  perRem,
  tabletScreen,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { noop } from '../utils';
import CheckboxGroup, { Option } from './CheckboxGroup';
import { paper, steel, tin, colorWithTransparency } from '../colors';

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

const dropdownContainer = css({
  position: 'absolute',
  width: `${222 / perRem}em`,
  right: 0,
  top: '-10px',

  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,

  display: 'none',
  flexDirection: 'column',

  boxSizing: 'border-box',
  padding: `${12 / perRem}em ${12 / perRem}em ${vminLinearCalc(
    mobileScreen,
    8,
    largeDesktopScreen,
    12,
    'px',
  )}`,
});

const showMenuStyles = css({
  display: 'flex',
});

interface SearchControlsProps {
  searchQuery?: string;
  onChangeSearch?: (newQuery: string) => void;
  onChangeFilter?: (filter: string) => void;
  filterTitle: string;
  filters?: Set<string>;
  filterOptions: Option<string>[];
  filterEnabled?: boolean;
  placeholder: string;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  searchQuery,
  onChangeSearch = noop,
  onChangeFilter = noop,
  placeholder,
  filters = new Set(),
  filterOptions,
  filterTitle,
  filterEnabled = true,
}) => {
  const [menuShown, setMenuShown] = useState(false);
  useEffect(() => {
    setMenuShown(false);
  }, [filterTitle]);

  return (
    <div role="search" css={searchContainerStyles}>
      <SearchField
        value={searchQuery || ''}
        placeholder={placeholder}
        onChange={onChangeSearch}
      />
      <div>
        <Button
          enabled={filterEnabled}
          active={menuShown}
          onClick={() => setMenuShown(!menuShown)}
        >
          {filterIcon}
          <span css={buttonTextStyles}>Filters</span>
        </Button>
        <div
          css={{
            position: 'relative',
          }}
        >
          <div css={[dropdownContainer, menuShown && showMenuStyles]}>
            <Caption asParagraph>
              <strong>{filterTitle}</strong>
            </Caption>
            <CheckboxGroup
              onChange={onChangeFilter}
              options={filterOptions}
              values={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchControls;
