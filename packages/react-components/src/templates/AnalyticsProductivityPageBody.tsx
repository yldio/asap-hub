import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { analytics } from '@asap-hub/routing';

import { Dropdown, Headline3, Paragraph, Subtitle } from '../atoms';
import { rem } from '../pixels';
import { ExportButton } from '../molecules';

import AnalyticsControls, {
  MetricOption,
} from '../molecules/AnalyticsControls';

const metricOptions: Record<MetricOption, string> = {
  user: 'User Productivity',
  team: 'Team Productivity',
};

const metricOptionList = Object.keys(metricOptions).map((value) => ({
  value: value as MetricOption,
  label: metricOptions[value as MetricOption],
}));

type ProductivityAnalyticsProps = Pick<
  ComponentProps<typeof AnalyticsControls>,
  'timeRange' | 'currentPage' | 'tags' | 'loadTags' | 'setTags'
> & {
  metric: MetricOption;
  setMetric: (option: MetricOption) => void;
  children: React.ReactNode;
  exportResults: () => Promise<void>;
};

const metricDropdownStyles = css({
  marginBottom: rem(48),
});

const tableHeaderStyles = css({
  paddingBottom: rem(24),
});

const controlsStyles = css({
  display: 'flex',
  flexDirection: 'row-reverse',
  gap: rem(32),
});

const AnalyticsProductivityPageBody: React.FC<ProductivityAnalyticsProps> = ({
  metric,
  setMetric,
  timeRange,
  tags,
  setTags,
  loadTags,
  currentPage,
  children,
  exportResults,
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
        Overview of ASAP outputs shared on the CRN Hub by {metric}.
      </Paragraph>
    </div>
    <div css={controlsStyles}>
      <ExportButton exportResults={exportResults} />
      <AnalyticsControls
        currentPage={currentPage}
        timeRange={timeRange}
        metricOption={metric}
        tags={tags}
        loadTags={loadTags}
        setTags={setTags}
        href={analytics({}).productivity({}).metric({ metric }).$}
      />
    </div>
    {children}
  </article>
);

export default AnalyticsProductivityPageBody;
