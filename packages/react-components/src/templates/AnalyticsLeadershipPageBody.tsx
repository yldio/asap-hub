import {
  LeadershipAndMembershipSortingDirection,
  SortLeadershipAndMembership,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';
import { Dropdown, Headline3, Paragraph, Subtitle } from '../atoms';
import { LeadershipMembershipTable } from '../organisms';
import { perRem } from '../pixels';

type MetricOption = 'working-group' | 'interest-group';
type MetricData = {
  id: string;
  name: string;
  leadershipRoleCount: number;
  previousLeadershipRoleCount: number;
  memberCount: number;
  previousMemberCount: number;
};

const metricOptions: Record<MetricOption, string> = {
  'working-group': 'Working Group Leadership & Membership',
  'interest-group': 'Interest Group Leadership & Membership',
};

const metricOptionList = Object.keys(metricOptions).map((value) => ({
  value: value as MetricOption,
  label: metricOptions[value as MetricOption],
}));

type LeadershipAndMembershipAnalyticsProps = ComponentProps<
  typeof PageControls
> & {
  metric: MetricOption;
  setMetric: (option: MetricOption) => void;
  data: MetricData[];
  sort: SortLeadershipAndMembership;
  setSort: (option: SortLeadershipAndMembership) => void;
  sortingDirection: LeadershipAndMembershipSortingDirection;
  setSortingDirection: (
    option: LeadershipAndMembershipSortingDirection,
  ) => void;
};

const metricDropdownStyles = css({
  marginBottom: `${48 / perRem}em`,
});

const tableHeaderStyles = css({
  paddingBottom: `${24 / perRem}em`,
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: `${36 / perRem}em`,
  paddingBottom: `${36 / perRem}em`,
});

const LeadershipPageBody: React.FC<LeadershipAndMembershipAnalyticsProps> = ({
  sort,
  setSort,
  sortingDirection,
  setSortingDirection,
  metric,
  setMetric,
  data,
  ...pageControlProps
}) => (
  <article>
    <div css={metricDropdownStyles}>
      <Subtitle>Metric</Subtitle>
      <Dropdown
        options={metricOptionList}
        value={metric}
        onChange={setMetric}
        required
      />
    </div>
    <div css={tableHeaderStyles}>
      <Headline3>{metricOptions[metric]}</Headline3>
      <Paragraph>
        Teams that are currently or have been previously in a leadership or a
        membership role within a Working Group.
      </Paragraph>
    </div>
    <LeadershipMembershipTable
      metric={metric}
      data={data}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
    />
    <section css={pageControlsStyles}>
      <PageControls {...pageControlProps} />
    </section>
  </article>
);

export default LeadershipPageBody;
