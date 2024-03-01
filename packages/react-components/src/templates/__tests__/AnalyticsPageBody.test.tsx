import { render, screen } from '@testing-library/react';

import AnalyticsPageBody from '../AnalyticsPageBody';

it('renders the selected metric', () => {
  render(
    <AnalyticsPageBody
      metric={'interestGroup'}
      data={[]}
      setMetric={() => {}}
    />,
  );
  expect(
    screen.getByText(/Interest Group Leadership & Membership/, {
      selector: 'h3',
    }),
  ).toBeVisible();
});
