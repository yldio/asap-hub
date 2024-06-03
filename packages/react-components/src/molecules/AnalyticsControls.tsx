import { css } from '@emotion/react';
import { TimeRangeOption } from '@asap-hub/model';
import { ComponentProps } from 'react';

import { dropdownChevronIcon } from '../icons';
import DropdownButton from './DropdownButton';
import { rem, tabletScreen } from '../pixels';
import { MultiSelect, Subtitle } from '../atoms';
import { noop, searchIcon } from '..';
import ExportButton from './ExportButton';

export type MetricOption = 'user' | 'team';
const containerStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',

  gap: rem(33),
  'span + svg': {
    width: '11px',
    marginRight: '10px',
  },
  paddingBottom: rem(33),
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

const viewContainerStyles = css({
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

const searchContainerStyles = css({
  display: 'flex',
  gap: rem(18),
  alignItems: 'center',
  paddingBottom: rem(24),
});

const searchStyles = css({
  flexGrow: 1,
});

const exportContainerStyles = css({
  display: 'flex',
  justifyContent: 'right',
  gap: rem(33),
  [`@media (max-width: ${tabletScreen.min}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    gap: 0,
  },
});

const timeRangeOptions: Record<TimeRangeOption, string> = {
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  'current-year': 'This year (Jan-Today)',
  'last-year': 'Last 12 months',
  all: 'Since Hub Launch (2020)',
};
const searchTexts = {
  user: {
    label: 'Users & Teams',
    placeholder: 'Enter user and/or team names...',
  },
  team: {
    label: 'Teams',
    placeholder: 'Enter team names...',
  },
};

interface AnalyticsControlsProps {
  readonly timeRange?: TimeRangeOption;
  // metric is optional for now since we haven't added search to the collaboration page
  readonly metricOption?: MetricOption;
  readonly tags: string[];
  readonly loadTags: ComponentProps<typeof MultiSelect>['loadOptions'];
  readonly setTags: (tags: string[]) => void;
  readonly href?: string;
  readonly currentPage?: number;
  readonly exportResults?: () => Promise<void>;
}
const AnalyticsControls: React.FC<AnalyticsControlsProps> = ({
  timeRange,
  metricOption,
  tags,
  setTags,
  loadTags = noop,
  exportResults,
  currentPage,
  href,
}) => (
  <>
    {metricOption && (
      <div css={searchContainerStyles}>
        <Subtitle>{searchTexts[metricOption].label}:</Subtitle>
        <span role="search" css={searchStyles}>
          <MultiSelect
            noMargin
            leftIndicator={searchIcon}
            noOptionsMessage={() => 'No results found'}
            loadOptions={loadTags}
            onChange={(items) => setTags(items.map(({ value }) => value))}
            values={tags.map((tag) => ({
              label: tag,
              value: tag,
            }))}
            key={`${tags.join('')}`}
            placeholder={searchTexts[metricOption].placeholder}
          />
        </span>
      </div>
    )}
    <span css={containerStyles}>
      {timeRange && (
        <span css={viewContainerStyles}>
          <strong>View:</strong>
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
      )}
      {exportResults && (
        <span css={exportContainerStyles}>
          <ExportButton exportResults={exportResults} />
        </span>
      )}
    </span>
  </>
);

export default AnalyticsControls;
