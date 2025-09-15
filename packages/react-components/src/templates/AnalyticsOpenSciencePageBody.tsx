import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { analytics } from '@asap-hub/routing';
import { colors, noop } from '..';
import {
  Dropdown,
  Headline3,
  MultiSelect,
  Paragraph,
  Subtitle,
} from '../atoms';
import { AnalyticsControls } from '../molecules';
import { rem } from '../pixels';

export type MetricOption = 'preprint-compliance' | 'publication-compliance';

const metricOptions: Record<MetricOption, string> = {
  'preprint-compliance': 'Preprint Compliance',
  'publication-compliance': 'Publication Compliance',
};

const metricDescription = {
  'preprint-compliance':
    'Number of preprints posted to a preprint repository and percentage posted prior to journal submission by each team',
  'publication-compliance':
    'Percent compliance by research output type for each team',
};

type OpenScienceAnalyticsProps = {
  children: React.ReactNode;
  tags: string[];
  loadTags?: ComponentProps<typeof MultiSelect>['loadOptions'];
  setTags: (tags: string[]) => void;
  metric: MetricOption;
  setMetric: (option: MetricOption) => void;
  exportResults: () => Promise<void>;
};

const metricDropdownStyles = css({
  marginBottom: rem(48),
});

const tableHeaderStyles = css({
  paddingBottom: rem(24),
});

const AnalyticsOpenSciencePageBody: React.FC<OpenScienceAnalyticsProps> = ({
  children,
  tags,
  setTags,
  loadTags = noop,
  metric,
  setMetric,
  exportResults,
}) => {
  const metricOptionList = Object.keys(metricOptions).map((value) => ({
    value: value as MetricOption,
    label: metricOptions[value as MetricOption],
  }));

  return (
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
        <Paragraph styles={css({ color: colors.neutral900.rgb })}>
          {metricDescription[metric]}.
        </Paragraph>
      </div>
      <AnalyticsControls
        currentPage={1}
        documentCategory={undefined}
        exportResults={exportResults}
        href={analytics({}).openScience({}).metric({ metric }).$}
        loadTags={loadTags}
        metricOption={'team'}
        outputType={undefined}
        setTags={setTags}
        tags={tags}
        timeRange="all"
      />
      {children}
    </article>
  );
};

export default AnalyticsOpenSciencePageBody;
