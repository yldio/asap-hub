import { css } from '@emotion/react';
import { analytics } from '@asap-hub/routing';

import { Dropdown, Headline3, Paragraph, Subtitle } from '../atoms';
import AnalyticsControls from '../molecules/AnalyticsControls';
import { perRem } from '../pixels';
import { ComponentProps } from 'react';

type MetricOption = 'user' | 'team';

const metricOptions: Record<MetricOption, string> = {
  user: 'User Productivity',
  team: 'Team Productivity',
};

const metricOptionList = Object.keys(metricOptions).map((value) => ({
  value: value as MetricOption,
  label: metricOptions[value as MetricOption],
}));

type LeadershipAndMembershipAnalyticsProps = Pick<
  ComponentProps<typeof AnalyticsControls>,
  'timeRange'
> & {
  metric: MetricOption;
  setMetric: (option: MetricOption) => void;
  children: React.ReactNode;
};

const metricDropdownStyles = css({
  marginBottom: `${48 / perRem}em`,
});

const tableHeaderStyles = css({
  paddingBottom: `${24 / perRem}em`,
});

const controlsStyles = css({
  display: 'flex',
  flexDirection: 'row-reverse',
});

const AnalyticsProductivityPageBody: React.FC<
  LeadershipAndMembershipAnalyticsProps
> = ({ metric, setMetric, timeRange, children }) => (
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
    <div css={controlsStyles}>
      <AnalyticsControls
        timeRange={timeRange}
        href={analytics({}).productivity({}).metric({ metric }).$}
      />
    </div>
    <div css={tableHeaderStyles}>
      <Headline3>{metricOptions[metric]}</Headline3>
      <Paragraph>
        Overview of ASAP outputs shared on the CRN Hub by {metric}.
      </Paragraph>
    </div>
    {children}
  </article>
);

export default AnalyticsProductivityPageBody;
