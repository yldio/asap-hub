import {
  LeadershipAndMembershipSortingDirection,
  SortLeadershipAndMembership,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls, SearchField } from '..';
import { Dropdown, Headline3, Paragraph, Subtitle } from '../atoms';
import { LeadershipMembershipTable } from '../organisms';
import { rem } from '../pixels';

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
  setSort: React.Dispatch<React.SetStateAction<SortLeadershipAndMembership>>;
  sortingDirection: LeadershipAndMembershipSortingDirection;
  setSortingDirection: React.Dispatch<
    React.SetStateAction<LeadershipAndMembershipSortingDirection>
  >;
  searchQuery: string;
  onChangeSearch: (newSearchQuery: string) => void;
};

const metricDropdownStyles = css({
  marginBottom: rem(48),
});

const tableHeaderStyles = css({
  paddingBottom: rem(24),
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

const searchContainerStyles = css({
  display: 'flex',
  gap: rem(18),
  alignItems: 'center',
  paddingBottom: rem(33)
})

const searchStyles = css({
  flexGrow: 1
})

const LeadershipPageBody: React.FC<LeadershipAndMembershipAnalyticsProps> = ({
  sort,
  setSort,
  sortingDirection,
  setSortingDirection,
  metric,
  setMetric,
  data,
  searchQuery,
  onChangeSearch,
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
    <div css={searchContainerStyles}>
      <Subtitle>Teams:</Subtitle>
      <span css={searchStyles}>
        <SearchField
          value={searchQuery}
          placeholder="Enter team names..."
          onChange={onChangeSearch}
        />
      </span>
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
