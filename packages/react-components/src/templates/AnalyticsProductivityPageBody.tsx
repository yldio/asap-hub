import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { PageControls } from '..';
import { Dropdown, Headline3, Paragraph, Subtitle } from '../atoms';
import { TeamProductivityTable, UserProductivityTable } from '../organisms';
import { TeamProductivityMetric } from '../organisms/TeamProductivityTable';
import { UserProductivityMetric } from '../organisms/UserProductivityTable';
import { perRem } from '../pixels';

type MetricOption = 'user' | 'team';

const metricOptions: Record<MetricOption, string> = {
  user: 'User Productivity',
  team: 'Team Productivity',
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
  userData: UserProductivityMetric[];
  teamData: TeamProductivityMetric[];
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

const AnalyticsProductivityPageBody: React.FC<
  LeadershipAndMembershipAnalyticsProps
> = ({ metric, setMetric, userData, teamData, ...pageControlProps }) => (
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
        Overview of ASAP outputs shared on the CRN Hub by {metric}.
      </Paragraph>
    </div>
    {metric === 'user' ? (
      <UserProductivityTable data={userData} />
    ) : (
      <TeamProductivityTable data={teamData} />
    )}
    <section css={pageControlsStyles}>
      <PageControls {...pageControlProps} />
    </section>
  </article>
);

export default AnalyticsProductivityPageBody;
