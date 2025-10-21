import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { CheckboxGroup } from '.';
import { FILTERS_KEY, FILTER_EVENT, FILTER_TITLE_KEY } from '../analytics';
import { Button } from '../atoms';
import { paper, steel, colorWithTransparency, tin } from '../colors';
import { filterIcon } from '../icons';
import {
  tabletScreen,
  rem,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { Option } from '../select';
import { noop } from '../utils';
import { Title } from './CheckboxGroup';

const buttonTextStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'unset',
  },
});

const dropdownContainer = css({
  position: 'absolute',
  width: rem(295),
  right: rem(0),
  top: rem(8),

  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  boxShadow: `0 2px 6px 0 ${colorWithTransparency(tin, 0.34).rgba}`,

  display: 'none',
  flexDirection: 'column',

  boxSizing: 'border-box',
  padding: `${rem(6)} ${rem(18)} ${vminLinearCalc(
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

export interface FilterProps<V extends string> {
  readonly filters?: Set<V>;
  readonly onChangeFilter?: (filter: V) => void;
  readonly filterOptions: ReadonlyArray<Option<V> | Title>;
}
export default function Filter<V extends string>({
  filters = new Set(),
  onChangeFilter = noop,
  filterOptions,
}: FilterProps<V>): ReturnType<React.FC> {
  const [menuShown, setMenuShown] = useState(false);
  useEffect(() => {
    setMenuShown(false);
  }, [filterOptions]);

  const [debouncedFilters] = useDebounce(filters, 5000);
  useEffect(() => {
    if (filters.size && filters === debouncedFilters) {
      window.dataLayer?.push({
        [FILTERS_KEY]: [...filters],
        event: FILTER_EVENT,
      });
    }

    return () => {
      window.dataLayer?.push({
        [FILTERS_KEY]: undefined,
        [FILTER_TITLE_KEY]: undefined,
      });
    };
  }, [debouncedFilters, filters]);

  return (
    <div>
      <Button
        noMargin
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
          <CheckboxGroup<V>
            onChange={onChangeFilter}
            options={filterOptions}
            values={filters}
          />
        </div>
      </div>
    </div>
  );
}
