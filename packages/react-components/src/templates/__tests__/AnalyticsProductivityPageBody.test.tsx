import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsProductivityPageBody } from '..';

describe('AnalyticsProductivityPageBody', () => {
  const props: ComponentProps<typeof AnalyticsProductivityPageBody> = {
    setMetric: () => null,
    exportResults: () => Promise.resolve(),
    metric: 'user',
    timeRange: '30d',
    currentPage: 5,
    children: <span>table</span>,
  };
  it('renders user tab', () => {
    const { container } = render(
      <AnalyticsProductivityPageBody {...props} metric="user" />,
    );

    expect(container).toHaveTextContent(
      'Overview of ASAP outputs shared on the CRN Hub by user',
    );
  });

  it('renders team tab', () => {
    const { container } = render(
      <AnalyticsProductivityPageBody {...props} metric="team" />,
    );

    expect(container).toHaveTextContent(
      'Overview of ASAP outputs shared on the CRN Hub by team',
    );
  });
});
