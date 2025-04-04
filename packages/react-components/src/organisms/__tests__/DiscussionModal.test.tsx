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

const defaultProps: ComponentProps<typeof DiscussionModal> = {
  type: 'start',
  onDismiss: jest.fn(),
  onSave: jest.fn(),
};

it('renders the form', async () => {
  render(<DiscussionModal {...defaultProps} />);

  expect(await screen.findByText(/Start Discussion/i)).toBeVisible();
  expect(screen.getByRole('button', { name: /Send/i })).toBeVisible();
});

it('data is sent on form submission', async () => {
  const onSave = jest.fn().mockResolvedValue(undefined);

  render(<DiscussionModal {...defaultProps} onSave={onSave} />);

  const titleInput = screen.getByRole('textbox', { name: /Title/i });
  userEvent.type(titleInput, 'test title');

  const textInput = screen.getByTestId('editor');
  await act(async () => {
    userEvent.click(textInput);
    userEvent.tab();
    fireEvent.input(textInput, { data: 'test message' });
    userEvent.tab();
  });

  const shareButton = screen.getByRole('button', { name: /Send/i });
  await waitFor(() => expect(shareButton).toBeEnabled());
  userEvent.click(shareButton);
  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({
      title: 'test title',
      text: 'test message',
    });
  });
});

it('send button is disabled when title is not provided', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const sendButton = screen.getByRole('button', { name: /Send/i });
  expect(sendButton).toBeDisabled();

  const textInput = screen.getByTestId('editor');
  await act(async () => {
    userEvent.click(textInput);
    userEvent.tab();
    fireEvent.input(textInput, { data: 'test message' });
    userEvent.tab();
  });

  expect(sendButton).toBeDisabled();
});

it('send button is disabled when text is not provided', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const sendButton = screen.getByRole('button', { name: /Send/i });
  expect(sendButton).toBeDisabled();

  await act(async () => {
    const titleInput = screen.getByRole('textbox', { name: /Title/i });
    userEvent.type(titleInput, 'test title');
  });

  expect(sendButton).toBeDisabled();
});

it('displays error message when title is bigger than 100 characters', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const titleInput = screen.getByRole('textbox', { name: /Title/i });
  userEvent.type(
    titleInput,
    'test title, test title, test title, test title, test title, test title, test title, test title, test title',
  );
  await act(async () => {
    userEvent.tab();
  });

  expect(
    screen.getAllByText(/Title cannot exceed 100 characters./i).length,
  ).toBeGreaterThanOrEqual(1);
});

it('displays cancellation confirmation on cancel', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const cancelButton = screen.getByRole('button', { name: /Cancel/i });
  await act(async () => {
    userEvent.click(cancelButton);
  });

  expect(
    screen.getByText(
      /Cancelling now will result in the loss of all entered data./,
    ),
  ).toBeVisible();
});
