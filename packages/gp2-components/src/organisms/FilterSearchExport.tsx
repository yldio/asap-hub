import { Button, filterIcon, SearchField } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import exportIcon from '../icons/export-icon';
import { mobileQuery } from '../layout';

type FilterSearchExportProps = {
  isAdministrator: boolean;
  onFiltersClick: () => void;
  onExportClick: () => void;
};

const FilterSearchExport: React.FC<FilterSearchExportProps> = ({
  isAdministrator,
  onFiltersClick,
  onExportClick,
}) => (
  <div
    css={css({
      width: '100%',
      display: 'grid',
      grid: '"filter search export" /min-content auto min-content',
      gridColumnGap: `32px`,
      alignItems: 'center',
      [mobileQuery]: {
        gap: '24px',
        grid: `
          "search search" max-content
          "filter export" max-content
          / 1fr 1fr
          `,
      },
    })}
  >
    <div css={css({ gridArea: 'filter' })}>
      <Button noMargin onClick={onFiltersClick}>
        {filterIcon}
        <span css={css({ [mobileQuery]: { display: 'none' } })}>Filters</span>
      </Button>
    </div>
    <div css={css({ gridArea: 'search' })}>
      <SearchField
        value=""
        onChange={() => {}}
        placeholder="Enter name or keyword..."
        padding={false}
      />
    </div>
    {isAdministrator && (
      <div css={css({ gridArea: 'export' })}>
        <Button noMargin onClick={onExportClick}>
          {exportIcon}
          <span css={css({ [mobileQuery]: { display: 'none' } })}>Export</span>
        </Button>
      </div>
    )}
  </div>
);
export default FilterSearchExport;
