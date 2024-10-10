import { render, screen } from '@testing-library/react';

import ComplianceReportHeader from '../ComplianceReportHeader';

it('renders the compliance report header content', () => {
  render(<ComplianceReportHeader />);
  expect(
    screen.getByRole('heading', { name: /Share a Compliance Report/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Share the compliance report associated with this manuscript.',
    ),
  ).toBeInTheDocument();
});
