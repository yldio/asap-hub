import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';
import QuickCheckReplyModal from '../QuickCheckReplyModal';

const discussionId = 'discussion-id';

const defaultProps: ComponentProps<typeof QuickCheckReplyModal> = {
  onDismiss: jest.fn(),
  discussionId,
  onReplyToDiscussion: jest.fn(),
};

it('renders the form', async () => {
  render(<QuickCheckReplyModal {...defaultProps} />);
  expect(screen.getByText(/Reply to quick check/i)).toBeVisible();
  expect(screen.getByRole('button', { name: /Send/i })).toBeVisible();
});

it('data is sent on form submission', async () => {
  const onReplyToDiscussion = jest.fn();
  render(
    <QuickCheckReplyModal
      {...defaultProps}
      onReplyToDiscussion={onReplyToDiscussion}
    />,
  );

  const replyEditor = screen.getByTestId('editor');
  await act(async () => {
    userEvent.click(replyEditor);
    userEvent.tab();
    fireEvent.input(replyEditor, { data: 'test reply' });
    userEvent.tab();
  });

  const shareButton = screen.getByRole('button', { name: /Send/i });
  await waitFor(() => expect(shareButton).toBeEnabled());
  userEvent.click(shareButton);
  await waitFor(() => {
    expect(onReplyToDiscussion).toHaveBeenCalledWith(discussionId, {
      replyText: 'test reply',
    });
  });
});

it('send button is enabled when reply is provided', async () => {
  render(<QuickCheckReplyModal {...defaultProps} />);

  const sendButton = screen.getByRole('button', { name: /Send/i });

  expect(sendButton).toBeDisabled();

  const replyEditor = screen.getByTestId('editor');
  await act(async () => {
    userEvent.click(replyEditor);
    userEvent.tab();
    fireEvent.input(replyEditor, { data: 'test reply' });
    userEvent.tab();
  });

  expect(sendButton).toBeEnabled();
});

it('displays error message when reply is bigger than 256 characters', async () => {
  render(<QuickCheckReplyModal {...defaultProps} />);

  const sendButton = screen.getByRole('button', { name: /Send/i });

  expect(sendButton).toBeDisabled();

  const replyEditor = screen.getByTestId('editor');
  await act(async () => {
    userEvent.click(replyEditor);
    userEvent.tab();
    fireEvent.input(replyEditor, {
      data: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec dapibus est, a ultrices magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In hac habitasse platea dictumst. Praesent sodales venenatis ipsum, dignissim lacinia tellus eleifend et.',
    });
    userEvent.tab();
  });

  expect(
    screen.getAllByText(/Reply cannot exceed 256 characters./i).length,
  ).toBeGreaterThanOrEqual(1);
});
