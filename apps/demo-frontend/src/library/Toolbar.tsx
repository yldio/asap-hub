/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import { Link } from 'react-router';

import { charcoal, lead, mint, paper, pine, rem, silver, steel, tin } from '../ui/theme';
import { FilterIcon, GridIcon, ListIcon, SearchIcon } from './icons';
import {
  sortLabels,
  statusFilterLabels,
  type SortMode,
  type StatusFilter,
  type ViewMode,
} from './state';

const barStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(12),
  paddingBottom: rem(16),
});

const searchWrapStyles = css({
  position: 'relative',
  flex: '1 1 ' + rem(220),
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

const toggleGroupStyles = css({
  display: 'flex',
  border: `1px solid ${steel.rgb}`,
  borderRadius: rem(6),
  overflow: 'hidden',
  backgroundColor: paper.rgb,
});

const toggleButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(36),
  height: rem(36),
  padding: 0,
  border: 'none',
  background: 'none',
  color: lead.rgb,
  cursor: 'pointer',
  ':hover': { backgroundColor: silver.rgb },
});

const toggleActiveStyles = css({
  backgroundColor: mint.rgb,
  color: pine.rgb,
  ':hover': { backgroundColor: mint.rgb },
});

const chipStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(8),
  padding: `${rem(8)} ${rem(14)}`,
  borderRadius: rem(18),
  border: `1px solid ${steel.rgb}`,
  backgroundColor: paper.rgb,
  font: 'inherit',
  fontSize: rem(14),
  color: charcoal.rgb,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  ':hover': { backgroundColor: silver.rgb },
});

const chipActiveStyles = css({
  backgroundColor: mint.rgb,
  borderColor: pine.rgb,
  color: pine.rgb,
  fontWeight: 'bold',
  ':hover': { backgroundColor: mint.rgb },
});

const uploadStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${rem(9)} ${rem(20)}`,
  borderRadius: rem(6),
  backgroundColor: pine.rgb,
  color: paper.rgb,
  fontSize: rem(14),
  fontWeight: 'bold',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  ':hover': { opacity: 0.9 },
});

const sortOptions: SortMode[] = ['newest', 'oldest', 'title'];

export const Toolbar: FC<{
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly sort: SortMode;
  readonly onSortChange: (sort: SortMode) => void;
  readonly view: ViewMode;
  readonly onViewChange: (view: ViewMode) => void;
  readonly statusFilter: StatusFilter;
  readonly onStatusFilterClick: () => void;
  readonly isCreator: boolean;
}> = ({
  query,
  onQueryChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  statusFilter,
  onStatusFilterClick,
  isCreator,
}) => (
  <div css={barStyles}>
    <div css={searchWrapStyles}>
      <span css={searchIconStyles}>
        <SearchIcon />
      </span>
      <input
        type="search"
        aria-label="Search videos"
        placeholder="Search videos"
        css={searchInputStyles}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </div>

    <select
      aria-label="Sort videos"
      css={selectStyles}
      value={sort}
      onChange={(event) => onSortChange(event.target.value as SortMode)}
    >
      {sortOptions.map((option) => (
        <option key={option} value={option}>
          {sortLabels[option]}
        </option>
      ))}
    </select>

    <div css={toggleGroupStyles} role="group" aria-label="View mode">
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={view === 'grid'}
        css={[toggleButtonStyles, view === 'grid' && toggleActiveStyles]}
        onClick={() => onViewChange('grid')}
      >
        <GridIcon />
      </button>
      <button
        type="button"
        aria-label="List view"
        aria-pressed={view === 'list'}
        css={[toggleButtonStyles, view === 'list' && toggleActiveStyles]}
        onClick={() => onViewChange('list')}
      >
        <ListIcon />
      </button>
    </div>

    {isCreator && (
      <button
        type="button"
        css={[chipStyles, statusFilter !== 'all' && chipActiveStyles]}
        onClick={onStatusFilterClick}
      >
        <FilterIcon size={14} />
        {statusFilterLabels[statusFilter]}
      </button>
    )}

    {isCreator && (
      <Link to="/studio/upload" css={uploadStyles}>
        Upload
      </Link>
    )}
  </div>
);
