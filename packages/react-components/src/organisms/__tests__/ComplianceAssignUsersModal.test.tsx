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

  it('renders the modal with correct initial state', async () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
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
    expect(screen.getByText('Test Manuscript')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetAssignedUsersSuggestions).toHaveBeenCalled();
    });
  });

  it('displays assigned users in the multi-select', async () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetAssignedUsersSuggestions).toHaveBeenCalled();
    });
  });

  it('calls onDismiss when cancel button is clicked', async () => {
    const mockOnDismiss = jest.fn();
    render(
      <ComplianceAssignUsersModal
        onDismiss={mockOnDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    await userEvent.click(screen.getByText('Cancel'));
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
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /Update/ }));

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
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    const input = screen.getByRole('combobox', { name: /Assign User/i });
    await userEvent.type(input, 'Bob');

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
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={[]}
      />,
    );

    expect(screen.getByRole('button', { name: /Assign/ })).toBeDisabled();

    await userEvent.click(
      screen.getByRole('combobox', { name: /Assign User/i }),
    );
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByLabelText(/Profile picture of Bob Johnson/i),
    );

    expect(screen.getByRole('button', { name: /Assign/ })).toBeEnabled();
  });

  it('displays Update button as disabled when all assigned users are removed', async () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={mockAssignedUsers}
      />,
    );

    expect(screen.getByRole('button', { name: /Update/ })).toBeEnabled();

    await userEvent.click(
      screen.getByRole('combobox', { name: /Assign User/i }),
    );
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole('button', { name: /Remove/i })).toHaveLength(2);
    await userEvent.click(
      screen.getByRole('button', { name: /Remove John Doe/i }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Remove Jane Smith/i }),
    );
    expect(screen.queryAllByRole('button', { name: /Remove/i })).toHaveLength(
      0,
    );

    expect(screen.getByRole('button', { name: /Update/ })).toBeDisabled();
  });

  it('displays Project and Team(s) for team-based project manuscripts', () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={[]}
        projectName="My Research Project"
      />,
    );

    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('My Research Project')).toBeInTheDocument();
    expect(screen.getByText('Team(s)')).toBeInTheDocument();
    expect(screen.getByText('Team A')).toBeInTheDocument();
  });

  it('displays Project without Team(s) for user-based project manuscripts', () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={[]}
        projectName="User Project"
        isUserBasedProject
      />,
    );

    expect(screen.getByText('Project')).toBeInTheDocument();
    expect(screen.getByText('User Project')).toBeInTheDocument();
    expect(screen.queryByText('Team(s)')).not.toBeInTheDocument();
  });

  it('displays Team(s) without Project when no project name', () => {
    render(
      <ComplianceAssignUsersModal
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        PillId={mockPillId}
        teams="Team A"
        manuscriptTitle="Test Manuscript"
        getAssignedUsersSuggestions={mockGetAssignedUsersSuggestions}
        assignedUsers={[]}
      />,
    );

    expect(screen.getByText('Team(s)')).toBeInTheDocument();
    expect(screen.queryByText('Project')).not.toBeInTheDocument();
  });
});
