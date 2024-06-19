import { css } from '@emotion/react';
import {
  DocumentTypeOption,
  SharingStatusOption,
  TimeRangeOption,
} from '@asap-hub/model';

import { dropdownChevronIcon } from '../icons';
import DropdownButton from './DropdownButton';
import { rem, tabletScreen } from '../pixels';

export type MetricOption = 'user' | 'team';

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

const documentCategoryOptions: Record<DocumentTypeOption, string> = {
  all: 'All',
  article: 'Article',
  bioinformatics: 'Bioinformatics',
  dataset: 'Dataset',
  'lab-resource': 'Lab Resource',
  protocol: 'Protocol',
};

const typeOptions: Record<SharingStatusOption, string> = {
  all: 'All',
  'asap-output': 'ASAP Output',
  'asap-public-output': 'ASAP Public Output',
};

interface AnalyticsControlsProps {
  readonly metric: MetricOption;
  readonly timeRange: TimeRangeOption;
  readonly documentCategory?: DocumentTypeOption;
  readonly type?: SharingStatusOption;
  readonly href: string;
  readonly currentPage: number;
}
const AnalyticsControls: React.FC<AnalyticsControlsProps> = ({
  metric,
  timeRange,
  documentCategory,
  type,
  currentPage,
  href,
}) => (
  <span css={containerStyles}>
    {metric === 'user' && documentCategory && (
      <>
        <strong>Document:</strong>
        <DropdownButton
          noMargin
          buttonChildren={() => (
            <>
              <span css={{ marginRight: rem(10) }}>
                {documentCategoryOptions[documentCategory]}
              </span>
              {dropdownChevronIcon}
            </>
          )}
        >
          {Object.keys(documentCategoryOptions).map((key) => ({
            item: <>{documentCategoryOptions[key as DocumentTypeOption]}</>,
            href: `${href}?documentCategory=${key}`,
          }))}
        </DropdownButton>
      </>
    )}
    {metric === 'team' && type && (
      <>
        <strong>Type:</strong>
        <DropdownButton
          noMargin
          buttonChildren={() => (
            <>
              <span css={{ marginRight: rem(10) }}>{typeOptions[type]}</span>
              {dropdownChevronIcon}
            </>
          )}
        >
          {Object.keys(typeOptions).map((key) => ({
            item: <>{typeOptions[key as SharingStatusOption]}</>,
            href: `${href}?type=${key}`,
          }))}
        </DropdownButton>
      </>
    )}
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
);

export default AnalyticsControls;
