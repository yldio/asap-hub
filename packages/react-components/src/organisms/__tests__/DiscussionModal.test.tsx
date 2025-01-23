import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';
import DiscussionModal from '../DiscussionModal';

const discussionId = 'discussion-id';

const defaultProps: ComponentProps<typeof DiscussionModal> = {
  title: 'Reply to quick check',
  editorLabel: 'Reply',
  ruleMessage: 'Reply cannot exceed 256 characters.',
  onDismiss: jest.fn(),
  discussionId,
  onSave: jest.fn(),
};

it('renders the form', async () => {
  render(<DiscussionModal {...defaultProps} />);

  expect(await screen.findByText(/Reply to quick check/i)).toBeVisible();
  expect(screen.getByRole('button', { name: /Send/i })).toBeVisible();
});

it('data is sent on form submission', async () => {
  const onSave = jest.fn();
  render(<DiscussionModal {...defaultProps} onSave={onSave} />);

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
    expect(onSave).toHaveBeenCalledWith(
      discussionId,
      {
        text: 'test reply',
      },
      undefined,
    );
  });
});

it('send button is enabled when reply is provided', async () => {
  render(<DiscussionModal {...defaultProps} />);

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
  render(<DiscussionModal {...defaultProps} />);

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
