import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiscussionsTab from '../DiscussionsTab';

describe('DiscussionsTab', () => {
  const mockCreateDiscussion = jest.fn();
  const defaultProps = {
    manuscriptId: 'test-manuscript-id',
    createDiscussion: mockCreateDiscussion,
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

  it('closes modal when clicking dismiss', async () => {
    render(<DiscussionsTab {...defaultProps} />);

    userEvent.click(screen.getByText('Start Discussion'));
    userEvent.click(screen.getByTitle('Close'));
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
});
