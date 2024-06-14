import { render, screen } from '@testing-library/react';

import ManuscriptHeader from '../ManuscriptHeader';

it('renders the manuscript header content', () => {
  render(<ManuscriptHeader />);
  expect(
    screen.getByRole('heading', { name: /Submit a Manuscript/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Submit your manuscript to receive a compliance report and find out which areas need to be improved before publishing your article.',
    ),
  ).toBeInTheDocument();
});
