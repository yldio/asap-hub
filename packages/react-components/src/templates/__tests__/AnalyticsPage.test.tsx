import { render } from '@testing-library/react';

import AnalyticsPage from '../AnalyticsPage';

it('renders the header', () => {
  const { getByRole } = render(<AnalyticsPage onExportAnalytics={jest.fn} />);
  expect(getByRole('heading', { level: 1 })).toHaveTextContent('Analytics');
});

it('renders the children', () => {
  const { getByText } = render(
    <AnalyticsPage onExportAnalytics={jest.fn}>Content</AnalyticsPage>,
  );
  expect(getByText('Content')).toBeVisible();
});
