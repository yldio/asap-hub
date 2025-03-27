import { manuscriptAuthor } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ComplianceReportCard from '../ComplianceReportCard';

const props: ComponentProps<typeof ComplianceReportCard> = {
  id: 'compliance-report-id',
  url: 'http://example.com/',
  description: 'compliance report description',
  count: 1,
  createdDate: '2024-12-10T20:36:54Z',
  createdBy: {
    ...manuscriptAuthor,
    displayName: 'Test User',
    id: 'test-user-id',
  },
};

it('displays compliance report description and url when expanded', () => {
  jest.spyOn(console, 'error').mockImplementation();
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
