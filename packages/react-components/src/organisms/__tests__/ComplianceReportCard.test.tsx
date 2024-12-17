import { manuscriptAuthor } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComplianceReportCard from '../ComplianceReportCard';

it('displays compliance report description, url and creation details when expanded', () => {
  const props = {
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
    createComplianceDiscussion: jest.fn(),
    getDiscussion: jest.fn(),
    setVersion: jest.fn(),
    onSave: jest.fn(),
  };
  const { getByText, queryByText, getByRole, rerender } = render(
    <ComplianceReportCard {...props} />,
  );

  expect(queryByText(/compliance report description/i)).not.toBeInTheDocument();
  expect(queryByText(/View Report/i)).not.toBeInTheDocument();
  expect(queryByText(/example.com/i)).not.toBeInTheDocument();
  expect(queryByText('10th December 2024')).not.toBeInTheDocument();
  expect(queryByText('Test User')).not.toBeInTheDocument();

  userEvent.click(getByRole('button'));

  rerender(<ComplianceReportCard {...props} />);

  expect(getByText(/compliance report description/i)).toBeVisible();
  expect(getByText(/View Report/i)).toBeVisible();
  expect(getByText(/View Report/i).closest('a')?.href).toBe(
    'http://example.com/',
  );
  expect(getByText('10th December 2024')).toBeVisible();
  expect(getByText('Test User').closest('a')!.href!).toContain(
    '/network/users/test-user-id',
  );
});
