import { manuscriptAuthor } from '@asap-hub/fixtures';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import ComplianceReportCard from '../ComplianceReportCard';

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
  versionId: 'version-id',
  manuscriptId: 'manuscript-id',
  createComplianceDiscussion: jest
    .fn()
    .mockImplementation(() => 'discussion-id'),
  getDiscussion: jest.fn(),
  setVersion: jest.fn(),
  onSave: jest.fn(),
  onEndDiscussion: jest.fn(),
};

it('displays compliance report description, url and creation details when expanded', () => {
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

it('calls setVersion when component is unmouted and a discussion was created', async () => {
  const { getByLabelText, findByText, unmount } = render(
    <ComplianceReportCard {...props} />,
  );

  await act(async () => {
    userEvent.click(getByLabelText('Expand Report'));
    userEvent.click(await findByText(/Start Discussion/i));
  });

  const replyEditor = screen.getByTestId('editor');
  await act(async () => {
    userEvent.click(replyEditor);
    userEvent.tab();
    fireEvent.input(replyEditor, { data: 'New discussion message' });
    userEvent.tab();
  });

  expect(await findByText(/Send/i)).toBeInTheDocument();
  await act(async () => {
    userEvent.click(await findByText(/Send/i));
  });

  await waitFor(() => {
    expect(props.createComplianceDiscussion).toHaveBeenCalled();
  });

  unmount();

  expect(props.setVersion).toHaveBeenCalled();
});
