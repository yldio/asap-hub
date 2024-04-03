import { render, screen } from '@testing-library/react';

import AnalyticsPage from '../AnalyticsPage';

it('renders the header', () => {
  const { getByRole } = render(<AnalyticsPage />);
  screen.debug(undefined, 5000000);
  expect(getByRole('heading', { level: 1 })).toHaveTextContent('Analytics');
});

it('renders the children', () => {
  const { getByText } = render(<AnalyticsPage>Content</AnalyticsPage>);
  expect(getByText('Content')).toBeVisible();
});
