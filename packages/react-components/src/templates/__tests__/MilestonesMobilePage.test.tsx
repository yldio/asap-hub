import { render, screen } from '@testing-library/react';

import MilestonesMobilePage from '../MilestonesMobilePage';

it('renders the page', () => {
  render(<MilestonesMobilePage />);
  expect(
    screen.getByText(/Milestones are only available/, { selector: 'span' }),
  ).toBeVisible();
});
