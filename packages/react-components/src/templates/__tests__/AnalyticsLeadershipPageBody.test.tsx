import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsLeadershipPageBody } from '..';

describe('AnalyticsLeadershipPageBody', () => {
  const props: ComponentProps<typeof AnalyticsLeadershipPageBody> = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
    setMetric: () => {},
    data: [],
    metric: 'interestGroup',
  };
  it('renders interest group tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="interestGroup" />,
    );

    expect(getAllByText('Interest Group Leadership & Membership').length).toBe(
      2,
    );
  });

  it('renders working group tab', () => {
    const { getAllByText } = render(
      <AnalyticsLeadershipPageBody {...props} metric="workingGroup" />,
    );

    expect(getAllByText('Working Group Leadership & Membership').length).toBe(
      2,
    );
  });
});
