import {
  Button,
  filterIcon,
  pixels,
  SearchField,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import exportIcon from '../icons/export-icon';
import { mobileQuery } from '../layout';

const { rem } = pixels;

const containerStyles = css({
  width: '100%',
  display: 'grid',
  grid: '"filter search export" /min-content auto min-content',
  gridColumnGap: rem(32),
  alignItems: 'center',
  [mobileQuery]: {
    gap: rem(24),
    grid: `
    "search search" max-content
    "filter export" max-content
    / 1fr 1fr
    `,
  },
});

const buttonTextStyles = css({ [mobileQuery]: { display: 'none' } });

const notAdminStyles = css({ grid: '"filter search" /min-content auto' });

type FilterSearchExportProps = {
  searchQuery: ComponentProps<typeof SearchField>['value'];
  onSearchQueryChange: ComponentProps<typeof SearchField>['onChange'];
  isAdministrator: boolean;
  onFiltersClick: () => void;
  onExportClick: () => void;
};

const FilterSearchExport: React.FC<FilterSearchExportProps> = ({
  isAdministrator,
  searchQuery,
  onSearchQueryChange,
  onFiltersClick,
  onExportClick,
}) => (
  <div css={[containerStyles, !isAdministrator && notAdminStyles]}>
    <div css={css({ gridArea: 'filter' })}>
      <Button noMargin onClick={onFiltersClick}>
        {filterIcon}
        <span css={buttonTextStyles}>Filters</span>
      </Button>
    </div>
    <div css={css({ gridArea: 'search' })}>
      <SearchField
        value={searchQuery}
        onChange={onSearchQueryChange}
        placeholder="Enter name or keyword..."
        padding={false}
      />
    </div>
    {isAdministrator && (
      <div css={css({ gridArea: 'export' })}>
        <Button noMargin onClick={onExportClick}>
          {exportIcon}
          <span css={buttonTextStyles}>Export</span>
        </Button>
      </div>
    )}
  </div>
);
export default FilterSearchExport;
