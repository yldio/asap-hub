import { css } from '@emotion/react';
import { TimeRangeOption } from '@asap-hub/model';

import { dropdownChevronIcon } from '../icons';
import DropdownButton from './DropdownButton';
import { rem, tabletScreen } from '../pixels';

const containerStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(15),
  'span + svg': {
    width: '11px',
    marginRight: '10px',
  },
  button: {
    padding: `${rem(8)} ${rem(16)}`,
  },

  [`@media (max-width: ${tabletScreen.min}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: rem(24),
    width: '100%',
  },
});

const timeRangeOptions: Record<TimeRangeOption, string> = {
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  'current-year': 'This year (Jan-Today)',
  'last-year': 'Last 12 months',
  all: 'Since Hub Launch (2020)',
};

interface AnalyticsControlsProps {
  readonly timeRange: TimeRangeOption;
  readonly href: string;
  readonly currentPage: number;
}
const AnalyticsControls: React.FC<AnalyticsControlsProps> = ({
  timeRange,
  currentPage,
  href,
}) => (
  <span css={containerStyles}>
    <strong>View as:</strong>
    <DropdownButton
      noMargin
      buttonChildren={() => (
        <>
          <span css={{ marginRight: rem(10) }}>
            {timeRangeOptions[timeRange]}
          </span>
          {dropdownChevronIcon}
        </>
      )}
    >
      {Object.keys(timeRangeOptions).map((key) => ({
        item: <>{timeRangeOptions[key as TimeRangeOption]}</>,
        href: `${href}?range=${key}&currentPage=${currentPage}`,
      }))}
    </DropdownButton>
  </span>
);

export default AnalyticsControls;
