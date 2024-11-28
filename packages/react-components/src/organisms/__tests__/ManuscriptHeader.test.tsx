import { render, screen } from '@testing-library/react';

import ManuscriptHeader from '../ManuscriptHeader';

it('renders the manuscript header content when creating a new manuscript', () => {
  render(<ManuscriptHeader />);
  expect(
    screen.getByRole('heading', { name: /Submit New Manuscript/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Start a new manuscript to receive an itemized compliance report outlining action items for compliance with the ASAP Open Science Policy.',
    ),
  ).toBeInTheDocument();
});

it('renders the manuscript header content when resubmitting manuscript', () => {
  render(<ManuscriptHeader resubmitManuscript />);
  expect(
    screen.getByRole('heading', { name: /Submit Revised Manuscript/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Resubmit your manuscript based on the last compliance report you received. All details below were duplicated from the previous manuscript.',
    ),
  ).toBeInTheDocument();
});
