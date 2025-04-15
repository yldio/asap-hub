import {
  manuscriptStatus,
  ManuscriptStatus,
  PartialManuscriptResponse,
} from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import ComplianceTableRow from '../ComplianceTableRow';

describe('ComplianceTableRow', () => {
  const data: PartialManuscriptResponse = {
    id: 'manuscript-id-1',
    lastUpdated: '2023-03-15T08:00:00Z',
    status: 'Addendum Required',
    team: { id: 'team-id', displayName: 'Test Team' },
    requestingApcCoverage: 'Yes',
    manuscriptId: 'DA1-000463-002-org-G-1',
    assignedUsers: [],
    title: 'Manuscript 1',
    teams: 'Test Team',
  };

  const defaultProps: ComponentProps<typeof ComplianceTableRow> = {
    data,
    isComplianceReviewer: true,
    getAssignedUsersSuggestions: jest.fn(),
    handleAssignUsersClick: jest.fn(),
    handleStatusClick: jest.fn(),
  };

  const renderComponent = (props = {}) =>
    render(
      <table>
        <tbody>
          <ComplianceTableRow {...defaultProps} {...props} />
        </tbody>
      </table>,
    );

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
    renderComponent();

    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('DA1-000463-002-org-G-1')).toBeInTheDocument();
    expect(screen.getByText('WED, 15 MAR 2023')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Addendum Required/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('user can not change status when not a compliance reviewer', () => {
    renderComponent({ isComplianceReviewer: false });

    expect(
      screen.getByRole('button', { name: /Addendum Required/i }),
    ).toBeDisabled();
  });

  it('disables status change for Closed (other) status', () => {
    const closedManuscript = {
      ...data,
      status: 'Closed (other)' as ManuscriptStatus,
    };
    renderComponent({ data: closedManuscript });

    const statusButton = screen.getByRole('button', {
      name: /Closed \(other\)/i,
    });
    expect(statusButton).toBeDisabled();
  });

  it('renders team name as a link', () => {
    renderComponent();

    const teamLink = screen.getByText('Test Team');
    expect(teamLink.tagName).toBe('A');
    expect(teamLink).toHaveAttribute(
      'href',
      expect.stringContaining('team-id'),
    );
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
  });
});
