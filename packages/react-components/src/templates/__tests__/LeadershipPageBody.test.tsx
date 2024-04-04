import { render, screen } from '@testing-library/react';

import AnalyticsLeadershipPageBody from '../AnalyticsLeadershipPageBody';

const pageControlProps = {
  numberOfPages: 1,
  numberOfItems: 3,
  currentPageIndex: 0,
  renderPageHref: () => '',
};
it('renders the selected metric', () => {
  render(
    <AnalyticsLeadershipPageBody
      metric={'interest-group'}
      data={[]}
      setMetric={() => {}}
      {...pageControlProps}
    />,
  );
  expect(
    screen.getByText(/Interest Group Leadership & Membership/, {
      selector: 'h3',
    }),
  ).toBeVisible();
});
