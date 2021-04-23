import css from '@emotion/css';
import React, { useEffect, useState } from 'react';

import { CheckboxGroup } from '.';
import { Button, Caption } from '../atoms';
import { paper, steel, colorWithTransparency, tin } from '../colors';
import { filterIcon } from '../icons';
import {
  tabletScreen,
  perRem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { Option } from '../select';
import { noop } from '../utils';

const buttonTextStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

const dropdownContainer = css({
  position: 'absolute',
  width: `${222 / perRem}em`,
  right: `-${6 / perRem}em`,
  top: `-${6 / perRem}em`,

  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,

  display: 'none',
  flexDirection: 'column',

  boxSizing: 'border-box',
  padding: `${6 / perRem}em ${18 / perRem}em ${vminLinearCalc(
    mobileScreen,
    6,
    largeDesktopScreen,
    12,
    'px',
  )}`,
});

const showMenuStyles = css({
  display: 'flex',
});

interface FilterProps {
  readonly filters?: Set<string>;
  readonly onChangeFilter?: (filter: string) => void;
  readonly filterOptions: Option<string>[];
  readonly filterTitle: string;
}
const Filter: React.FC<FilterProps> = ({
  filters = new Set(),
  onChangeFilter = noop,
  filterOptions,
  filterTitle,
}) => {
  const [menuShown, setMenuShown] = useState(false);
  useEffect(() => {
    setMenuShown(false);
  }, [filterTitle]);

  return (
    <div>
      <Button active={menuShown} onClick={() => setMenuShown(!menuShown)}>
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
  );
};

export default Filter;
