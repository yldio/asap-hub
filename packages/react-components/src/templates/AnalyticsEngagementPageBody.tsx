import {
  EngagementPerformance,
  EngagementResponse,
  EngagementSortingDirection,
  SortEngagement,
} from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { CaptionItem, PageControls, PercentageIcon } from '..';
import { Headline3, Paragraph } from '../atoms';
import { AnalyticsControls } from '../molecules';
import { CaptionCard, EngagementTable } from '../organisms';
import { rem } from '../pixels';
import { lead } from '../colors';

const tableHeaderStyles = css({
  paddingBottom: rem(24),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

const captionLegend = css({
  display: 'grid',
  gridColumn: '1 / span 2',
  gridTemplateColumns: `${rem(20)} auto`,
  gridTemplateRows: 'auto',
  gap: rem(14),
  alignItems: 'start',
  '& p': {
    color: lead.rgb,
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
});

type AnalyticsEngagementPageBodyProps = Pick<
  ComponentProps<typeof AnalyticsControls>,
  'currentPage' | 'loadTags' | 'setTags' | 'tags' | 'timeRange'
> &
  ComponentProps<typeof PageControls> & {
    data: EngagementResponse[];
    sort: SortEngagement;
    setSort: React.Dispatch<React.SetStateAction<SortEngagement>>;
    sortingDirection: EngagementSortingDirection;
    setSortingDirection: React.Dispatch<
      React.SetStateAction<EngagementSortingDirection>
    >;
    performance: EngagementPerformance;
    exportResults: () => Promise<void>;
  };

const AnalyticsEngagementPageBody: React.FC<
  AnalyticsEngagementPageBodyProps
> = ({
  data,
  exportResults,
  tags,
  timeRange,
  setTags,
  loadTags,
  sort,
  setSort,
  sortingDirection,
  setSortingDirection,
  performance,
  ...pageControlsProps
}) => (
  <article>
    <div css={tableHeaderStyles}>
      <Headline3>Representation of Presenters</Headline3>
      <Paragraph>
        Number of presentations conducted by each team, along with an overview
        of which type of presenters were represented.
      </Paragraph>
    </div>
    <AnalyticsControls
      currentPage={pageControlsProps.currentPageIndex}
      metricOption={'team'}
      tags={tags}
      loadTags={loadTags}
      setTags={setTags}
      timeRange={timeRange}
      href={analytics({}).engagement({}).$}
      exportResults={exportResults}
    />
    <CaptionCard>
      <>
        <CaptionItem label="Events" {...performance.events} />
        <CaptionItem label="Total Speakers" {...performance.totalSpeakers} />
        <CaptionItem
          label="U.S.: All Roles"
          percentage
          {...performance.uniqueAllRoles}
        />
        <CaptionItem
          label="U.S.: Key Personnel"
          percentage
          {...performance.uniqueKeyPersonnel}
        />
        <div css={captionLegend}>
          <PercentageIcon title="percentage" color={lead.rgb} />
          <Paragraph>
            'Unique Speakers: All Roles' and 'Unique Speakers: Key Personnel'
            percentage is based on 'Members'
          </Paragraph>
        </div>
      </>
    </CaptionCard>
    <EngagementTable
      data={data}
      performance={performance}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
    />
    <section css={pageControlsStyles}>
      <PageControls {...pageControlsProps} />
    </section>
  </article>
);

export default AnalyticsEngagementPageBody;
