import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { article, PageControls } from '..';
import { Headline3, Paragraph } from '../atoms';
import { ComplianceControls } from '../molecules';
import { ComplianceTable } from '../organisms';
import { rem } from '../pixels';

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

const iconStyles = css({
  display: 'inline-flex',
  svg: {
    width: rem(48),
    height: rem(48),
    path: {
      fill: '#00202C',
    },
  },
});

type ComplianceDashboardProps = ComponentProps<typeof PageControls> &
  Pick<
    ComponentProps<typeof ComplianceControls>,
    | 'completedStatus'
    | 'requestedAPCCoverage'
    | 'selectedStatuses'
    | 'onSelectStatus'
  > &
  Pick<
    ComponentProps<typeof ComplianceTable>,
    | 'onUpdateManuscript'
    | 'getAssignedUsersSuggestions'
    | 'isComplianceReviewer'
    | 'data'
    | 'sort'
    | 'sortingDirection'
    | 'setSort'
    | 'setSortingDirection'
  >;

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({
  isComplianceReviewer,
  data,
  sort,
  sortingDirection,
  setSort,
  setSortingDirection,
  onUpdateManuscript,
  getAssignedUsersSuggestions,
  selectedStatuses,
  onSelectStatus,
  ...pageControlsProps
}) => (
  <article>
    <ComplianceControls
      {...pageControlsProps}
      selectedStatuses={selectedStatuses}
      isComplianceReviewer={isComplianceReviewer}
      onSelectStatus={onSelectStatus}
    />
    {data.length > 0 ? (
      <main css={{ paddingTop: rem(32) }}>
        <ComplianceTable
          isComplianceReviewer={isComplianceReviewer}
          data={data}
          sort={sort}
          sortingDirection={sortingDirection}
          setSort={setSort}
          setSortingDirection={setSortingDirection}
          onUpdateManuscript={onUpdateManuscript}
          getAssignedUsersSuggestions={getAssignedUsersSuggestions}
        />
        <section css={pageControlsStyles}>
          <PageControls {...pageControlsProps} />
        </section>
      </main>
    ) : (
      <main css={{ textAlign: 'center', paddingTop: rem(48) }}>
        <span css={iconStyles}>{article}</span>
        <Headline3>No manuscripts available.</Headline3>
        <Paragraph accent="lead">
          When a team shares a manuscript for a compliance review, it will be
          listed here.
        </Paragraph>
      </main>
    )}
  </article>
);

export default ComplianceDashboard;
