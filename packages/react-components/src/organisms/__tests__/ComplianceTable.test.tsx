import {
  complianceInitialSortingDirection,
  PartialManuscriptResponse,
} from '@asap-hub/model';
import { render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ComplianceTable from '../ComplianceTable';

describe('ComplianceTable', () => {
  const mockOnUpdateManuscript = jest.fn();
  const pageControlsProps = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
    onUpdateManuscript: mockOnUpdateManuscript,
  };

  const assignedUser = {
    id: 'user-id',
    firstName: 'Test',
    lastName: 'User',
    avatarUrl: 'https://example.com',
  };

  const complianceData: PartialManuscriptResponse = {
    id: 'manuscript-id-1',
    lastUpdated: '2023-01-01T08:00:00Z',
    status: 'Addendum Required',
    team: { id: 'team-id', displayName: 'Test Team' },
    requestingApcCoverage: 'Yes',
    manuscriptId: 'DA1-000463-002-org-G-1',
    title: 'Manuscript 1',
    teams: 'Test Team',
    assignedUsers: [assignedUser],
  };

  const defaultProps: ComponentProps<typeof ComplianceTable> = {
    ...pageControlsProps,
    data: [complianceData],
    sort: 'team_asc',
    setSort: jest.fn(),
    sortingDirection: complianceInitialSortingDirection,
    setSortingDirection: jest.fn(),
    isComplianceReviewer: true,
    getAssignedUsersSuggestions: jest.fn(),
  };

  it('renders data', () => {
    const { getByText } = render(<ComplianceTable {...defaultProps} />);
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  describe('status change modal', () => {
    it('opens status change modal when selecting a different status', async () => {
      const { getByRole, getByText } = render(
        <ComplianceTable {...defaultProps} />,
      );

      const statusButton = getByRole('button', {
        name: /Addendum Required/i,
      });
      userEvent.click(statusButton);

      const newStatus = getByRole('button', { name: /Compliant/i });
      userEvent.click(newStatus);

      expect(getByText(/Set status to compliant\?/i)).toBeInTheDocument();
    });

    it('calls onUpdateManuscript when confirming status change', async () => {
      const { getByRole } = render(<ComplianceTable {...defaultProps} />);

      const statusButton = getByRole('button', {
        name: /Addendum Required/i,
      });
      userEvent.click(statusButton);

      const newStatus = getByRole('button', { name: /Compliant/i });
      userEvent.click(newStatus);

      const confirmButton = getByRole('button', {
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
      const { getByRole, getByText } = render(
        <ComplianceTable {...defaultProps} />,
      );

      const statusButton = getByRole('button', {
        name: /Addendum Required/i,
      });
      userEvent.click(statusButton);

      const differentStatus = getByRole('button', {
        name: /Submit Final Publication/i,
      });
      userEvent.click(differentStatus);

      expect(getByText(/Update status and notify\?/i)).toBeInTheDocument();
    });

    it('does not open modal when clicking the current status', () => {
      const data = [
        {
          ...complianceData,
          assignedUsers: [],
        },
      ];
      const { getByRole, queryByText } = render(
        <ComplianceTable {...defaultProps} data={data} />,
      );

      const statusButton = getByRole('button', {
        name: /Addendum Required/i,
      });
      userEvent.click(statusButton);

      const menu = getByRole('list');
      const sameStatus = within(menu).getByRole('button', {
        name: /Addendum Required/i,
      });
      userEvent.click(sameStatus);

      expect(
        queryByText(/Update status and notify\?/i),
      ).not.toBeInTheDocument();
    });
  });

  describe('assign users modal', () => {
    const data = [
      {
        ...complianceData,
        requestingApcCoverage: undefined,
        assignedUsers: [],
      },
    ];
    it('opens when clicking the assign button', () => {
      const { getByLabelText, getByRole, queryByRole } = render(
        <ComplianceTable {...defaultProps} data={data} />,
      );

      expect(queryByRole('dialog')).not.toBeInTheDocument();

      userEvent.click(getByLabelText(/Assign Users/i));
      expect(
        within(getByRole('dialog')).getByText(/Assign User/i, {
          selector: 'h3',
        }),
      ).toBeInTheDocument();
      expect(
        within(getByRole('dialog')).getByText(/N\/A/i),
      ).toBeInTheDocument();
    });

    it('closes modal when clicking the close button', () => {
      const { getByLabelText, getByRole, queryByText } = render(
        <ComplianceTable {...defaultProps} data={data} />,
      );
      userEvent.click(getByLabelText(/Assign Users/i));

      userEvent.click(within(getByRole('dialog')).getByTitle(/close/i));

      expect(
        queryByText(/Assign User/i, {
          selector: 'h3',
        }),
      ).not.toBeInTheDocument();
    });

    it('calls onUpdateManuscript when assigning users and closes modal', async () => {
      const { getByLabelText, getByRole, queryByText } = render(
        <ComplianceTable {...defaultProps} />,
      );
      userEvent.click(getByLabelText(/Edit Assigned Users/i));
      userEvent.click(getByRole('button', { name: 'Assign' }));
      await waitFor(() => {
        expect(mockOnUpdateManuscript).toHaveBeenCalledWith('manuscript-id-1', {
          assignedUsers: [assignedUser.id],
        });
      });

      expect(
        queryByText(/Assign User/i, {
          selector: 'h3',
        }),
      ).not.toBeInTheDocument();
    });
  });
});
