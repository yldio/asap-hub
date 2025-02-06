import {
  manuscriptStatus,
  ManuscriptStatus,
  PartialManuscriptResponse,
} from '@asap-hub/model';
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
    title: 'Manuscript 1',
    teams: 'Test Team',
  };

  const mockOnUpdateManuscript = jest.fn();

  const defaultProps: ComponentProps<typeof ComplianceTableRow> = {
    data,
    isComplianceReviewer: true,
    onUpdateManuscript: mockOnUpdateManuscript,
    getAssignedUsersSuggestions: jest.fn(),
  };

  const renderComponent = (props = {}) =>
    render(<ComplianceTableRow {...defaultProps} {...props} />);

  const closedStatuses: ManuscriptStatus[] = ['Closed (other)', 'Compliant'];
  const notClosedStatuses = manuscriptStatus.filter(
    (status) => !closedStatuses.includes(status),
  );

  const assignedUser = {
    id: 'user-id-1',
    firstName: 'Taylor',
    lastName: 'Swift',
    avatarUrl: 'https://example.com',
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

  it('user can not change status when not a compliance reviewer', () => {
    render(
      <ComplianceTableRow {...defaultProps} isComplianceReviewer={false} />,
    );

    expect(
      screen.getByRole('button', { name: /Addendum Required/i }),
    ).toBeDisabled();
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

  describe('status changes', () => {
    it('disables status button when not a compliance reviewer', () => {
      renderComponent({ isComplianceReviewer: false });
      expect(
        screen.getByRole('button', { name: /Addendum Required/i }),
      ).toBeDisabled();
    });

    it('disables status change for Closed (other) status', () => {
      renderComponent({
        data: { ...data, status: 'Closed (other)' as ManuscriptStatus },
      });
      expect(
        screen.getByRole('button', { name: /Closed \(other\)/i }),
      ).toBeDisabled();
    });

    describe('status change modal', () => {
      const openStatusMenu = () => {
        userEvent.click(
          screen.getByRole('button', { name: /Addendum Required/i }),
        );
      };

      it('opens when selecting a different status', () => {
        renderComponent();
        openStatusMenu();
        userEvent.click(screen.getByRole('button', { name: /Compliant/i }));
        expect(
          screen.getByText(/Set status to compliant\?/i),
        ).toBeInTheDocument();
      });

      it('does not open when selecting current status', () => {
        renderComponent();
        openStatusMenu();
        const menu = screen.getByRole('list');
        userEvent.click(
          within(menu).getByRole('button', { name: /Addendum Required/i }),
        );
        expect(
          screen.queryByText(/Update status and notify\?/i),
        ).not.toBeInTheDocument();
      });

      it('updates manuscript when confirming status change', async () => {
        renderComponent();
        openStatusMenu();
        userEvent.click(screen.getByRole('button', { name: /Compliant/i }));
        await waitFor(() => {
          userEvent.click(
            screen.getByRole('button', {
              name: /Set to Compliant and Notify/i,
            }),
          );
        });
        await waitFor(() => {
          expect(mockOnUpdateManuscript).toHaveBeenCalledWith(
            'manuscript-id-1',
            {
              status: 'Compliant',
            },
          );
        });
      });
    });
  });

  describe('assigned users', () => {
    const testAssignButton = ({
      status,
      isReviewer,
      hasAssignedUsers,
      shouldShow,
    }: {
      status: ManuscriptStatus;
      isReviewer: boolean;
      hasAssignedUsers: boolean;
      shouldShow: boolean;
    }) => {
      const buttonLabel = hasAssignedUsers
        ? /Edit Assigned Users/i
        : /Assign Users/i;
      const assignedUsers = hasAssignedUsers ? [assignedUser] : [];

      renderComponent({
        isComplianceReviewer: isReviewer,
        data: { ...data, status, assignedUsers },
      });

      const button = screen.queryByLabelText(buttonLabel);
      shouldShow
        ? expect(button).toBeInTheDocument()
        : expect(button).not.toBeInTheDocument();
    };

    it('shows "No users assigned" when empty', () => {
      renderComponent();
      expect(screen.getByText('No users assigned')).toBeInTheDocument();
    });

    it('shows two users and count badge for additional users', () => {
      renderComponent({
        data: {
          ...data,
          assignedUsers: [
            assignedUser,
            { id: 'user-id-2', firstName: 'Sabrina', lastName: 'Carpenter' },
            { id: 'user-id-3', firstName: 'Billie', lastName: 'Eilish' },
          ],
        },
      });

      expect(
        screen.getByLabelText(/Profile picture of Taylor Swift/),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Profile picture of Sabrina Carpenter/),
      ).toBeInTheDocument();
      expect(
        screen.queryByLabelText(/Profile picture of Billie Eilish/),
      ).not.toBeInTheDocument();
      expect(
        screen.getByLabelText(/Profile picture placeholder: \+1/),
      ).toBeInTheDocument();
    });

    describe('assign/edit buttons visibility', () => {
      /* eslint-disable-next-line jest/expect-expect */
      it.each(notClosedStatuses)(
        'shows assign button for empty assigned users when user is reviewer and status is %s',
        (status) =>
          testAssignButton({
            status,
            isReviewer: true,
            hasAssignedUsers: false,
            shouldShow: true,
          }),
      );

      /* eslint-disable-next-line jest/expect-expect */
      it.each(closedStatuses)(
        'hides assign button for empty assigned users when user is reviewer and status is %s',
        (status) =>
          testAssignButton({
            status,
            isReviewer: true,
            hasAssignedUsers: false,
            shouldShow: false,
          }),
      );

      /* eslint-disable-next-line jest/expect-expect */
      it.each(notClosedStatuses)(
        'shows edit button with assigned users when user is reviewer and status is %s',
        (status) =>
          testAssignButton({
            status,
            isReviewer: true,
            hasAssignedUsers: true,
            shouldShow: true,
          }),
      );

      /* eslint-disable-next-line jest/expect-expect */
      it.each(closedStatuses)(
        'hides edit button with assigned users when user is reviewer and status is %s',
        (status) =>
          testAssignButton({
            status,
            isReviewer: true,
            hasAssignedUsers: true,
            shouldShow: false,
          }),
      );

      /* eslint-disable-next-line jest/expect-expect */
      it.each(manuscriptStatus)(
        'hides buttons when user is not reviewer for status %s',
        (status) => {
          testAssignButton({
            status,
            isReviewer: false,
            hasAssignedUsers: false,
            shouldShow: false,
          });
          testAssignButton({
            status,
            isReviewer: false,
            hasAssignedUsers: true,
            shouldShow: false,
          });
        },
      );
    });

    describe('assign users modal', () => {
      it('opens when clicking the assign button', () => {
        renderComponent({
          data: {
            ...data,
            requestingApcCoverage: null,
            assignedUsers: [],
          },
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        userEvent.click(screen.getByLabelText(/Assign Users/i));
        expect(
          within(screen.getByRole('dialog')).getByText(/Assign User/i, {
            selector: 'h3',
          }),
        ).toBeInTheDocument();
        expect(
          within(screen.getByRole('dialog')).getByText(/N\/A/i),
        ).toBeInTheDocument();
      });

      it('closes modal when clicking the close button', () => {
        renderComponent();
        userEvent.click(screen.getByLabelText(/Assign Users/i));

        userEvent.click(
          within(screen.getByRole('dialog')).getByTitle(/close/i),
        );

        expect(
          screen.queryByText(/Assign User/i, {
            selector: 'h3',
          }),
        ).not.toBeInTheDocument();
      });

      it('calls onUpdateManuscript when assigning users and closes modal', async () => {
        renderComponent({
          data: {
            ...data,
            assignedUsers: [assignedUser],
          },
        });
        userEvent.click(screen.getByLabelText(/Edit Assigned Users/i));
        userEvent.click(screen.getByRole('button', { name: 'Assign' }));
        await waitFor(() => {
          expect(mockOnUpdateManuscript).toHaveBeenCalledWith(
            'manuscript-id-1',
            { assignedUsers: [assignedUser.id] },
          );
        });

        expect(
          screen.queryByText(/Assign User/i, {
            selector: 'h3',
          }),
        ).not.toBeInTheDocument();
      });
    });
  });
});
