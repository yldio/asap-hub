import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  const input = screen.getByRole('textbox', {
    name: /details/i,
  });

  userEvent.type(input, 'test reply');
  const shareButton = screen.getByRole('button', { name: /Send/i });
  await waitFor(() => expect(shareButton).toBeEnabled());
  userEvent.click(shareButton);
  await waitFor(() => {
    expect(onReplyToDiscussion).toHaveBeenCalledWith(discussionId, {
      replyText: 'test reply',
    });
  });
});

it('displays error message when reply is missing', async () => {
  render(<QuickCheckReplyModal {...defaultProps} />);

  const input = screen.getByRole('textbox', {
    name: /details/i,
  });
  fireEvent.blur(input);

  await waitFor(() => {
    expect(screen.getAllByText(/Please provide details./i).length).toBe(1);
  });

  userEvent.type(input, 'test reply');
  fireEvent.blur(input);

  await waitFor(() => {
    expect(screen.queryByText(/Please provide details./i)).toBeNull();
  });
});
