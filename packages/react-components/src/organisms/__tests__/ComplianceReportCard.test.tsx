import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComplianceReportCard from '../ComplianceReportCard';

it('displays compliance report description and url when expanded', () => {
  const props = {
    url: 'http://example.com/',
    description: 'compliance report description',
    count: 1,
  };
  const { getByText, queryByText, getByRole, rerender } = render(
    <ComplianceReportCard {...props} />,
  );

  expect(queryByText(/compliance report description/i)).not.toBeInTheDocument();
  expect(queryByText(/View Report/i)).not.toBeInTheDocument();
  expect(queryByText(/example.com/i)).not.toBeInTheDocument();

  userEvent.click(getByRole('button'));

  rerender(<ComplianceReportCard {...props} />);

  expect(getByText(/compliance report description/i)).toBeVisible();
  expect(getByText(/View Report/i)).toBeVisible();
  expect(getByText(/View Report/i).closest('a')?.href).toBe(
    'http://example.com/',
  );
});
