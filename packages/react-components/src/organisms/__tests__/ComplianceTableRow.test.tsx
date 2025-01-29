import { ManuscriptStatus, PartialManuscriptResponse } from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ComplianceTableRow from '../ComplianceTableRow';

describe('ComplianceTableRow', () => {
  const data: PartialManuscriptResponse = {
    id: 'DA1-000463-002-org-G-1',
    lastUpdated: '2023-03-15T08:00:00Z',
    status: 'Addendum Required',
    team: { id: 'team-id', displayName: 'Test Team' },
    requestingApcCoverage: 'Yes',
    manuscriptId: 'manuscript-id-1',
    assignedUsers: [],
  };

  const mockOnUpdateManuscript = jest.fn();

  const defaultProps: ComponentProps<typeof ComplianceTableRow> = {
    data,
    onUpdateManuscript: mockOnUpdateManuscript,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all manuscript information correctly', () => {
    render(<ComplianceTableRow {...defaultProps} />);

    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('DA1-000463-002-org-G-1')).toBeInTheDocument();
    expect(screen.getByText('WED, 15 MAR 2023')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Addendum Required/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('opens status change modal when selecting a different status', async () => {
    render(<ComplianceTableRow {...defaultProps} />);

    const statusButton = screen.getByRole('button', {
      name: /Addendum Required/i,
    });
    userEvent.click(statusButton);

    const newStatus = screen.getByRole('button', { name: /Compliant/i });
    userEvent.click(newStatus);

    expect(screen.getByText(/Set status to compliant\?/i)).toBeInTheDocument();
  });

  it('calls onUpdateManuscript when confirming status change', async () => {
    render(<ComplianceTableRow {...defaultProps} />);

    const statusButton = screen.getByRole('button', {
      name: /Addendum Required/i,
    });
    userEvent.click(statusButton);

    const newStatus = screen.getByRole('button', { name: /Compliant/i });
    userEvent.click(newStatus);

    const confirmButton = screen.getByRole('button', {
      name: /Set to Compliant and Notify/i,
    });

    await waitFor(() => {
      userEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(mockOnUpdateManuscript).toHaveBeenCalledWith('manuscript-id-1', {
        status: 'Compliant',
      });
    });
  });

  it('opens modal when clicking in a different status than the current one', () => {
    render(<ComplianceTableRow {...defaultProps} />);

    const statusButton = screen.getByRole('button', {
      name: /Addendum Required/i,
    });
    userEvent.click(statusButton);

    const differentStatus = screen.getByRole('button', {
      name: /Submit Final Publication/i,
    });
    userEvent.click(differentStatus);

    expect(screen.getByText(/Update status and notify\?/i)).toBeInTheDocument();
  });

  it('does not open modal when clicking the current status', () => {
    render(<ComplianceTableRow {...defaultProps} />);

    const statusButton = screen.getByRole('button', {
      name: /Addendum Required/i,
    });
    userEvent.click(statusButton);

    const menu = screen.getByRole('list');
    const sameStatus = within(menu).getByRole('button', {
      name: /Addendum Required/i,
    });
    userEvent.click(sameStatus);

    expect(
      screen.queryByText(/Update status and notify\?/i),
    ).not.toBeInTheDocument();
  });

  it('disables status change for Closed (other) status', () => {
    const closedManuscript = {
      ...data,
      status: 'Closed (other)' as ManuscriptStatus,
    };

    render(<ComplianceTableRow {...defaultProps} data={closedManuscript} />);

    const statusButton = screen.getByRole('button', {
      name: /Closed \(other\)/i,
    });
    expect(statusButton).toBeDisabled();
  });

  it('renders team name as a link', () => {
    render(<ComplianceTableRow {...defaultProps} />);

    const teamLink = screen.getByText('Test Team');
    expect(teamLink.tagName).toBe('A');
    expect(teamLink).toHaveAttribute(
      'href',
      expect.stringContaining('team-id'),
    );
  });
});
