import {
  EngagementPerformance,
  EngagementResponse,
  EngagementSortingDirection,
  SortEngagement,
} from '@asap-hub/model';
import { analytics } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { CaptionItem, PageControls } from '..';
import { Headline3, Paragraph } from '../atoms';
import { AnalyticsControls } from '../molecules';
import { CaptionCard, EngagementTable } from '../organisms';
import { rem } from '../pixels';

const tableHeaderStyles = css({
  paddingBottom: rem(24),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
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
    <CaptionCard
      legend={`'Unique Speakers: All Roles' and 'Unique Speakers: Key Personnel'
            percentage is based on 'Members'`}
    >
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
