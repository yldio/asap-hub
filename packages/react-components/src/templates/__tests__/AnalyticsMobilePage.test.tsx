import { render, screen } from '@testing-library/react';

import AnalyticsMobilePage from '../AnalyticsMobilePage';

it('renders the page', () => {
  render(<AnalyticsMobilePage />);
  expect(
    screen.getByText(/Analytics are only available/, { selector: 'span' }),
  ).toBeVisible();
});
