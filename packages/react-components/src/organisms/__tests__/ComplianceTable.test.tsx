import {
  complianceInitialSortingDirection,
  ManuscriptStatus,
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
      await userEvent.click(statusButton);

      const newStatus = getByRole('button', { name: /Compliant/i });
      await userEvent.click(newStatus);

      expect(getByText(/Set status to compliant\?/i)).toBeInTheDocument();
    });

    it('calls onUpdateManuscript when confirming status change', async () => {
      const { getByRole } = render(<ComplianceTable {...defaultProps} />);

      const statusButton = getByRole('button', {
        name: /Addendum Required/i,
      });
      await userEvent.click(statusButton);

      const newStatus = getByRole('button', { name: /Compliant/i });
      await userEvent.click(newStatus);

      const confirmButton = getByRole('button', {
        name: /Set to Compliant and Notify/i,
      });

      await waitFor(() => {
        await userEvent.click(confirmButton);
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
      await userEvent.click(statusButton);

      const differentStatus = getByRole('button', {
        name: /Submit Final Publication/i,
      });
      await userEvent.click(differentStatus);

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
      await userEvent.click(statusButton);

      const menu = getByRole('list');
      const sameStatus = within(menu).getByRole('button', {
        name: /Addendum Required/i,
      });
      await userEvent.click(sameStatus);

      expect(
        queryByText(/Update status and notify\?/i),
      ).not.toBeInTheDocument();
    });
  });

  describe('assign users modal', () => {
    const data = [
      {
        ...complianceData,
        assignedUsers: [],
      },
    ];
    it('opens when clicking the assign button', () => {
      const { getByLabelText, getByRole, queryByRole } = render(
        <ComplianceTable {...defaultProps} data={data} />,
      );

      expect(queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getByLabelText(/Assign Users/i));
      expect(
        within(getByRole('dialog')).getByText(/Assign User/i, {
          selector: 'h3',
        }),
      ).toBeInTheDocument();
    });

    it('closes modal when clicking the close button', () => {
      const { getByLabelText, getByRole, queryByText } = render(
        <ComplianceTable {...defaultProps} data={data} />,
      );
      await userEvent.click(getByLabelText(/Assign Users/i));

      await userEvent.click(within(getByRole('dialog')).getByTitle(/close/i));

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
      await userEvent.click(getByLabelText(/Edit Assigned Users/i));
      await userEvent.click(getByRole('button', { name: 'Update' }));
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

  describe('update apc coverage details modal', () => {
    const data = [
      {
        ...complianceData,
        status: 'Compliant' as ManuscriptStatus,
        apcRequested: false,
      },
    ];
    it('opens when clicking the Edit APC Coverage Details button', () => {
      const { getByRole, queryByRole } = render(
        <ComplianceTable {...defaultProps} data={data} />,
      );

      expect(queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(
        getByRole('button', { name: 'Edit APC Coverage Details' }),
      );

      expect(
        within(getByRole('dialog')).getByText(/APC Coverage/i, {
          selector: 'h3',
        }),
      ).toBeInTheDocument();
    });

    it('closes modal when clicking the close button', async () => {
      const { findByRole, getByRole, queryByText } = render(
        <ComplianceTable {...defaultProps} data={data} />,
      );
      await userEvent.click(
        getByRole('button', { name: 'Edit APC Coverage Details' }),
      );

      expect(
        await findByRole('heading', { name: 'APC Coverage' }),
      ).toBeInTheDocument();

      await userEvent.click(within(getByRole('dialog')).getByTitle(/close/i));

      expect(
        queryByText(/APC Coverage/i, {
          selector: 'h3',
        }),
      ).not.toBeInTheDocument();
    });

    it('calls onUpdateManuscript when updating apc coverage details and closes modal', async () => {
      const apcDetails = {
        apcRequested: true,
        apcAmountRequested: 200,
        apcCoverageRequestStatus: 'paid',
        apcAmountPaid: 200,
      };
      const manuscriptsResponse = [
        {
          ...complianceData,
          status: 'Compliant' as ManuscriptStatus,
          ...apcDetails,
        } as PartialManuscriptResponse,
      ];
      const { findByRole, getByRole, queryByText } = render(
        <ComplianceTable {...defaultProps} data={manuscriptsResponse} />,
      );

      await userEvent.click(
        getByRole('button', { name: 'Edit APC Coverage Details' }),
      );

      expect(
        await findByRole('heading', { name: 'APC Coverage' }),
      ).toBeInTheDocument();

      await userEvent.click(getByRole('button', { name: 'Update' }));
      await waitFor(() => {
        expect(mockOnUpdateManuscript).toHaveBeenCalledWith('manuscript-id-1', {
          ...apcDetails,
        });
      });

      expect(
        queryByText(/APC Coverage/i, {
          selector: 'h3',
        }),
      ).not.toBeInTheDocument();
    });

    it('calls onUpdateManuscript with correct values when updating apc coverage details', async () => {
      const { findByRole, getByRole } = render(
        <ComplianceTable {...defaultProps} data={data} />,
      );

      await userEvent.click(
        getByRole('button', { name: 'Edit APC Coverage Details' }),
      );

      expect(
        await findByRole('heading', { name: 'APC Coverage' }),
      ).toBeInTheDocument();

      await userEvent.click(getByRole('button', { name: 'Update' }));
      await waitFor(() => {
        expect(mockOnUpdateManuscript).toHaveBeenCalledWith('manuscript-id-1', {
          apcRequested: false,
          apcAmountRequested: undefined,
          apcCoverageRequestStatus: undefined,
          apcAmountPaid: undefined,
        });
      });
    });
  });
});
