import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';
import { Dropdown, Headline3, Paragraph, Subtitle } from '../atoms';
import { LeadershipMembershipTable } from '../organisms';
import { perRem } from '../pixels';

type MetricOption = 'workingGroup' | 'interestGroup';
type MetricData = {
  id: string;
  name: string;
  leadershipRoleCount: number;
  previousLeadershipRoleCount: number;
  memberCount: number;
  previousMemberCount: number;
};

const metricOptions: Record<MetricOption, string> = {
  workingGroup: 'Working Group Leadership & Membership',
  interestGroup: 'Interest Group Leadership & Membership',
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
};
const metricDropdownStyles = css({
  marginBottom: `${48 / perRem}em`,
});

const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: `${36 / perRem}em`,
  paddingBottom: `${36 / perRem}em`,
});

const AnalyticsPageBody: React.FC<LeadershipAndMembershipAnalyticsProps> = ({
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
      />
    </div>
    <Headline3>{metricOptions[metric]}</Headline3>
    <Paragraph>
      Teams that are currently or have been previously in a leadership or a
      membership role within a Working Group.
    </Paragraph>
    <LeadershipMembershipTable data={data} />
    <section css={pageControlsStyles}>
      <PageControls {...pageControlProps} />
    </section>
  </article>
);

export default AnalyticsPageBody;
