import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsLeadershipPageBody } from '..';

describe('AnalyticsLeadershipPageBody', () => {
  const props: ComponentProps<typeof AnalyticsLeadershipPageBody> = {
    setMetric: () => {},
    exportResults: () => Promise.resolve(),
    metric: 'interest-group',
    setTags: jest.fn(),
    tags: [],
    isOSChampionEnabled: true,
    children: <></>,
  };

  it('renders interest group tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="interest-group" />,
    );

    expect(getAllByText('Interest Group Leadership & Membership').length).toBe(
      2,
    );
  });

  it('renders working group tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="working-group" />,
    );

    expect(getAllByText('Working Group Leadership & Membership').length).toBe(
      2,
    );
  });

  it('renders OS champion tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="os-champion" />,
    );

    expect(getAllByText('Open Science Champion').length).toBe(2);
  });

  it('filters out OS champion option from dropdown when feature flag is off', async () => {
    const { queryByText } = render(
      <AnalyticsLeadershipPageBody
        {...props}
        metric="working-group"
        isOSChampionEnabled={false}
      />,
    );

    expect(queryByText('Open Science Champion')).not.toBeInTheDocument();
  });
});
