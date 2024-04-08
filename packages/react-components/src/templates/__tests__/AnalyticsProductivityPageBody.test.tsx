import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsProductivityPageBody } from '..';

describe('AnalyticsProductivityPageBody', () => {
  const props: ComponentProps<typeof AnalyticsProductivityPageBody> = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
    setMetric: () => null,
    userData: [],
    teamData: [],
    metric: 'user',
  };
  it('renders user tab', () => {
    const { getAllByText } = render(
      <AnalyticsProductivityPageBody {...props} metric="user" />,
    );

    expect(getAllByText('User Productivity').length).toBe(2);
  });

  it('renders team tab', () => {
    const { getAllByText } = render(
      <AnalyticsProductivityPageBody {...props} metric="team" />,
    );

    expect(getAllByText('Team Productivity').length).toBe(2);
  });
});
