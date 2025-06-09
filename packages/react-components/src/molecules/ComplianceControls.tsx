import type {
  CompletedStatusOption,
  RequestedAPCCoverageOption,
} from '@asap-hub/model';
import {
  requestedAPCCoverageOptions,
  completedStatusOptions,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { DropdownButton, ExportButton } from '.';
import { dropdownChevronIcon } from '../icons';
import { rem, tabletScreen } from '../pixels';

const countContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const filterContainerStyles = css({
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
  marginLeft: 'auto',
  '> div': {
    height: '100%',
    '> button': {
      alignItems: 'center',
    },
  },

  [`@media (max-width: ${tabletScreen.min}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: rem(24),
    width: '100%',
  },
});

const controlsContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const filtersWrapperStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(32),
});

const dropdownLabelStyles = css({
  marginRight: rem(8),
});

type ComplianceControlsProps = {
  completedStatus: CompletedStatusOption;
  requestedAPCCoverage: RequestedAPCCoverageOption;
  manuscriptCount: number;
  generateLink: (
    completedStatus: string,
    requestedAPCCoverage: string,
  ) => string;
  exportResults?: () => Promise<void>;
};

const ComplianceControls = ({
  completedStatus,
  requestedAPCCoverage,
  generateLink,
  manuscriptCount,
  exportResults,
}: ComplianceControlsProps) => {
  const resultsFoundText =
    manuscriptCount === 1
      ? `${manuscriptCount} result found`
      : `${manuscriptCount} results found`;
  return (
    <div css={controlsContainerStyles}>
      <div css={countContainerStyles}>
        <strong>{resultsFoundText}</strong>
      </div>
      <div css={filtersWrapperStyles}>
        <div css={filterContainerStyles}>
          <strong>Completed Status:</strong>
          <DropdownButton
            noMargin
            buttonChildren={() => (
              <>
                <span css={dropdownLabelStyles}>
                  {completedStatusOptions[completedStatus]}
                </span>
                {dropdownChevronIcon}
              </>
            )}
          >
            {Object.keys(completedStatusOptions).map((statusOption) => ({
              item: (
                <>
                  {
                    completedStatusOptions[
                      statusOption as CompletedStatusOption
                    ]
                  }
                </>
              ),
              href: generateLink(statusOption, requestedAPCCoverage),
            }))}
          </DropdownButton>
        </div>
        <div css={filterContainerStyles}>
          <strong>Requested APC Coverage:</strong>
          <DropdownButton
            noMargin
            buttonChildren={() => (
              <>
                <span css={dropdownLabelStyles}>
                  {requestedAPCCoverageOptions[requestedAPCCoverage]}
                </span>
                {dropdownChevronIcon}
              </>
            )}
          >
            {Object.keys(requestedAPCCoverageOptions).map(
              (apcCoverageOption) => ({
                item: (
                  <>
                    {
                      requestedAPCCoverageOptions[
                        apcCoverageOption as RequestedAPCCoverageOption
                      ]
                    }
                  </>
                ),
                href: generateLink(completedStatus, apcCoverageOption),
              }),
            )}
          </DropdownButton>
        </div>
        <div css={filterContainerStyles}>
          <ExportButton exportResults={exportResults} />
        </div>
      </div>
    </div>
  );
};

export default ComplianceControls;
