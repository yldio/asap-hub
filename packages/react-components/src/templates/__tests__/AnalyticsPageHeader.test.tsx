import { render, screen } from '@testing-library/react';

import AnalyticsPageHeader from '../AnalyticsPageHeader';

it('renders the header', () => {
  render(<AnalyticsPageHeader onExportAnalytics={jest.fn} />);
  expect(screen.getByText(/Analytics/, { selector: 'h1' })).toBeVisible();
});
