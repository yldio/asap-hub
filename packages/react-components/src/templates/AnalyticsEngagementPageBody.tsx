import {
  EngagementResponse,
  EngagementSortingDirection,
  SortEngagement,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { PageControls } from '..';
import { Headline3, MultiSelect, Paragraph } from '../atoms';
import { AnalyticsControls } from '../molecules';
import { EngagementTable } from '../organisms';
import { rem } from '../pixels';

const tableHeaderStyles = css({
  paddingBottom: rem(24),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

type AnalyticsEngagementPageBodyProps = ComponentProps<typeof PageControls> & {
  tags: string[];
  loadTags?: ComponentProps<typeof MultiSelect>['loadOptions'];
  setTags: (tags: string[]) => void;
  data: EngagementResponse[];
  sort: SortEngagement;
  setSort: React.Dispatch<React.SetStateAction<SortEngagement>>;
  sortingDirection: EngagementSortingDirection;
  setSortingDirection: React.Dispatch<
    React.SetStateAction<EngagementSortingDirection>
  >;
};
const AnalyticsEngagementPageBody: React.FC<
  AnalyticsEngagementPageBodyProps
> = ({
  data,
  tags,
  setTags,
  loadTags,
  sort,
  setSort,
  sortingDirection,
  setSortingDirection,
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
      metricOption={'team'}
      tags={tags}
      loadTags={loadTags}
      setTags={setTags}
    />
    <EngagementTable
      data={data}
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
