/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';

import { SearchIcon } from '../library/icons';
import { charcoal, paper, pine, rem, steel, tin } from './theme';

const barStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(12),
  padding: rem(24),
});

const searchWrapStyles = css({
  position: 'relative',
  flex: `1 1 ${rem(220)}`,
  minWidth: rem(180),
  display: 'flex',
  alignItems: 'center',
});

const searchIconStyles = css({
  position: 'absolute',
  left: rem(10),
  display: 'flex',
  color: tin.rgb,
  pointerEvents: 'none',
});

const searchInputStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  padding: `${rem(9)} ${rem(12)} ${rem(9)} ${rem(34)}`,
  borderRadius: rem(6),
  border: `1px solid ${steel.rgb}`,
  backgroundColor: paper.rgb,
  font: 'inherit',
  fontSize: rem(15),
  color: charcoal.rgb,
  ':focus': { outline: 'none', borderColor: pine.rgb },
});

const selectStyles = css({
  padding: `${rem(9)} ${rem(10)}`,
  borderRadius: rem(6),
  border: `1px solid ${steel.rgb}`,
  backgroundColor: paper.rgb,
  font: 'inherit',
  fontSize: rem(14),
  color: charcoal.rgb,
  cursor: 'pointer',
});

export type FilterOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

export type FilterSelect = {
  readonly label: string;
  readonly value: string;
  readonly options: ReadonlyArray<FilterOption<string>>;
  readonly onChange: (value: string) => void;
};

export const useDebounced = <T,>(value: T, delayMs = 250): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
};

export const TableFilters: FC<{
  readonly searchLabel: string;
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly selects: ReadonlyArray<FilterSelect>;
}> = ({ searchLabel, query, onQueryChange, selects }) => (
  <div css={barStyles}>
    <div css={searchWrapStyles}>
      <span css={searchIconStyles}>
        <SearchIcon />
      </span>
      <input
        type="search"
        aria-label={searchLabel}
        placeholder={searchLabel}
        css={searchInputStyles}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </div>
    {selects.map((select) => (
      <select
        key={select.label}
        aria-label={select.label}
        css={selectStyles}
        value={select.value}
        onChange={(event) => select.onChange(event.target.value)}
      >
        {select.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ))}
  </div>
);
