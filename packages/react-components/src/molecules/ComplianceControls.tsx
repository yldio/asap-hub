import type {
  CompletedStatusOption,
  RequestedAPCCoverageOption,
} from '@asap-hub/model';
import {
  completedStatusOptions,
  requestedAPCCoverageOptions,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';
import { dropdownChevronIcon } from '../icons';
import { ManuscriptByStatus } from '../organisms';
import { rem, tabletScreen } from '../pixels';
import { DropdownButton } from '.';

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
  paddingTop: rem(32),
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

type ComplianceControlsProps = ComponentProps<typeof PageControls> &
  Pick<
    ComponentProps<typeof ManuscriptByStatus>,
    'selectedStatuses' | 'onSelectStatus'
  > & {
    completedStatus: CompletedStatusOption;
    requestedAPCCoverage: RequestedAPCCoverageOption;
    isComplianceReviewer: boolean;
    manuscriptCount: number;
    generateLink: (
      href: string,
      currentPage: number,
      completedStatus: string,
      requestedAPCCoverage: string,
      statuses: string[],
    ) => string;
  };

const ComplianceControls = ({
  completedStatus,
  currentPageIndex,
  isComplianceReviewer,
  onSelectStatus,
  renderPageHref,
  requestedAPCCoverage,
  selectedStatuses,
  generateLink,
  manuscriptCount,
}: ComplianceControlsProps) => {
  const href = renderPageHref(currentPageIndex);
  const resultsFoundText =
    manuscriptCount === 1
      ? `${manuscriptCount} result found`
      : `${manuscriptCount} results found`;
  return (
    <>
      <ManuscriptByStatus
        shouldHideCompleteStatus={completedStatus === 'hide'}
        isComplianceReviewer={isComplianceReviewer}
        selectedStatuses={selectedStatuses}
        onSelectStatus={onSelectStatus}
      />
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
                href: generateLink(
                  href,
                  currentPageIndex,
                  statusOption,
                  requestedAPCCoverage,
                  selectedStatuses,
                ),
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
                  href: generateLink(
                    href,
                    currentPageIndex,
                    completedStatus,
                    apcCoverageOption,
                    selectedStatuses,
                  ),
                }),
              )}
            </DropdownButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplianceControls;
