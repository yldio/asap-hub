import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthorOption } from '../AuthorSelect';
import ComplianceAssignUsersModal from '../ComplianceAssignUsersModal';

const mockAssignedUsers = [
  {
    author: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      avatarUrl: 'avatar-url-1',
    },
    label: 'John Doe',
    value: 'user-1',
  },
  {
    author: {
      id: 'user-2',
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      avatarUrl: 'avatar-url-2',
    },
    label: 'Jane Smith',
    value: 'user-2',
  },
];

const mockPillId = () => (
  <div data-testid="pill-id">DA1-000463-002-org-G-1</div>
);

const mockGetAssignedUsersSuggestions = jest.fn().mockResolvedValue([
  {
    author: {
      id: 'user-3',
      firstName: 'Bob',
      lastName: 'Johnson',
      displayName: 'Bob Johnson',
      avatarUrl: 'avatar-url-3',
    },
    label: 'Bob Johnson',
    value: 'user-3',
  },
] as AuthorOption[]);

describe('ComplianceAssignUsersModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const onConfirm = jest.fn();
  const onDismiss = jest.fn();

  it('renders the modal with correct initial state', () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        apcCoverage="Yes"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Assign User' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pill-id')).toBeInTheDocument();
    expect(screen.getByText('Team A')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Test Manuscript')).toBeInTheDocument();
  });

  it('displays assigned users in the multi-select', () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        apcCoverage="Yes"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('calls onDismiss when cancel button is clicked', () => {
    const mockOnDismiss = jest.fn();
    render(
      <ComplianceAssignUsersModal
        onDismiss={mockOnDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        apcCoverage="Yes"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    userEvent.click(screen.getByText('Cancel'));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm with updated users when save button is clicked', async () => {
    const mockOnConfirm = jest.fn();
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={mockOnConfirm}
        PillId={mockPillId}
        teams="Team A"
        apcCoverage="Yes"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: /Update/ }));

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith({
        assignedUsers: mockAssignedUsers,
      });
    });
  });

  it('calls getAssignedUsersSuggestions when searching for users', async () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        apcCoverage="Yes"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    const input = screen.getByRole('textbox', { name: /Assign User/i });
    userEvent.type(input, 'Bob');

    await waitFor(() => {
      expect(mockGetAssignedUsersSuggestions).toHaveBeenCalled();
    });
  });

  it('displays Assign button as disabled when no users are selected', async () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        apcCoverage="Yes"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={[]}
      />,
    );

    expect(screen.getByRole('button', { name: /Assign/ })).toBeDisabled();

    userEvent.click(screen.getByRole('textbox', { name: /Assign User/i }));
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    userEvent.click(screen.getByLabelText(/Profile picture of Bob Johnson/i));

    expect(screen.getByRole('button', { name: /Assign/ })).toBeEnabled();
  });

  it('displays Assign button as enabled when removing all previous assignedusers', async () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        apcCoverage="Yes"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    expect(screen.getByRole('button', { name: /Update/ })).toBeEnabled();

    userEvent.click(screen.getByRole('textbox', { name: /Assign User/i }));
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getAllByLabelText(/Remove/i)).toHaveLength(2);
    userEvent.click(screen.getByLabelText(/Remove John Doe/i));
    userEvent.click(screen.getByLabelText(/Remove Jane Smith/i));
    expect(screen.queryAllByLabelText(/Remove/i)).toHaveLength(0);

    expect(screen.getByRole('button', { name: /Update/ })).toBeEnabled();
  });
});
