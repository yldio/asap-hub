import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import DiscussionsTab from '../DiscussionsTab';

describe('DiscussionsTab', () => {
  const mockCreateDiscussion = jest.fn();
  const defaultProps: ComponentProps<typeof DiscussionsTab> = {
    manuscriptId: 'test-manuscript-id',
    createDiscussion: mockCreateDiscussion,
    discussions: [],
    onReplyToDiscussion: jest.fn(),
    canParticipateInDiscussion: true,
    isActiveManuscript: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the start discussion button', () => {
    render(<DiscussionsTab {...defaultProps} />);
    expect(screen.getByText('Start Discussion')).toBeInTheDocument();
  });

  it('opens discussion modal when clicking the button', async () => {
    render(<DiscussionsTab {...defaultProps} />);

    userEvent.click(screen.getByText('Start Discussion'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes modal when clicking Cancel Discussion', async () => {
    render(<DiscussionsTab {...defaultProps} />);

    userEvent.click(screen.getByText('Start Discussion'));
    await act(async () => {
      userEvent.click(screen.getByText('Cancel'));
    });
    userEvent.click(screen.getByText('Cancel Discussion'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls createDiscussion when saving with valid data', async () => {
    mockCreateDiscussion.mockResolvedValueOnce('new-discussion-id');
    render(<DiscussionsTab {...defaultProps} />);

    userEvent.click(screen.getByText('Start Discussion'));

    userEvent.type(screen.getByLabelText(/title/i), 'Test Discussion');
    const textInput = screen.getByTestId('editor');
    await act(async () => {
      userEvent.click(textInput);
      userEvent.tab();
      fireEvent.input(textInput, { data: 'Test Message' });
      userEvent.tab();
    });

    userEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockCreateDiscussion).toHaveBeenCalledWith(
        'test-manuscript-id',
        'Test Discussion',
        'Test Message',
      );
    });
  });

  it('shows "Show more" button when there are more than 5 discussions', () => {
    const discussions = Array.from({ length: 6 }, (_, i) => ({
      id: `discussion-${i}`,
      title: `Discussion ${i}`,
      text: `Text ${i}`,
      createdBy: {
        id: 'user-1',
        displayName: 'User 1',
        firstName: 'User',
        lastName: 'One',
        avatarUrl: '',
        alumniSinceDate: undefined,
        teams: [{ id: 'team-1', name: 'Team 1' }],
      },
      createdAt: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      replies: [],
    }));

    render(<DiscussionsTab {...defaultProps} discussions={discussions} />);
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  it('shows all discussions when clicking "Show more"', async () => {
    const discussions = Array.from({ length: 6 }, (_, i) => ({
      id: `discussion-${i}`,
      title: `Discussion ${i}`,
      text: `Text ${i}`,
      createdBy: {
        id: 'user-1',
        displayName: 'User 1',
        firstName: 'User',
        lastName: 'One',
        avatarUrl: '',
        alumniSinceDate: undefined,
        teams: [{ id: 'team-1', name: 'Team 1' }],
      },
      createdAt: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      replies: [],
    }));

    render(<DiscussionsTab {...defaultProps} discussions={discussions} />);
    userEvent.click(screen.getByText('Show more'));

    discussions.forEach((discussion) => {
      expect(screen.getByText(discussion.title)).toBeInTheDocument();
    });
  });

  it('does not show "Show more" button when there are exactly 5 discussions', () => {
    const discussions = Array.from({ length: 5 }, (_, i) => ({
      id: `discussion-${i}`,
      title: `Discussion ${i}`,
      text: `Text ${i}`,
      createdBy: {
        id: 'user-1',
        displayName: 'User 1',
        firstName: 'User',
        lastName: 'One',
        avatarUrl: '',
        alumniSinceDate: undefined,
        teams: [{ id: 'team-1', name: 'Team 1' }],
      },
      createdAt: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      replies: [],
    }));

    render(<DiscussionsTab {...defaultProps} discussions={discussions} />);
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
  });

  it('shows message when user cannot participate in discussions', () => {
    render(
      <DiscussionsTab {...defaultProps} canParticipateInDiscussion={false} />,
    );
    expect(
      screen.getByText('Only authorized users can participate in Discussions.'),
    ).toBeInTheDocument();
  });

  it('shows message when manuscript is not active', () => {
    render(<DiscussionsTab {...defaultProps} isActiveManuscript={false} />);
    expect(
      screen.getByText(
        'Discussions for this manuscript have ended as it is either compliant or closed.',
      ),
    ).toBeInTheDocument();
  });

  it('renders empty state when there are no discussions', () => {
    render(<DiscussionsTab {...defaultProps} discussions={[]} />);
    expect(screen.getByText('Start Discussion')).toBeInTheDocument();
    expect(screen.queryByText('Show more')).not.toBeInTheDocument();
  });
});
