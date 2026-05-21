import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ComponentProps } from 'react';
import userEvent from '@testing-library/user-event';
import DiscussionModal from '../DiscussionModal';

const mockHandleFileUpload: ComponentProps<
  typeof DiscussionModal
>['handleFileUpload'] = jest.fn(() =>
  Promise.resolve({
    id: 'file-id',
    filename: 'test.pdf',
    url: 'https://example.com/test.pdf',
  }),
);

const defaultProps: ComponentProps<typeof DiscussionModal> = {
  type: 'start',
  onDismiss: jest.fn(),
  onSave: jest.fn(),
  handleFileUpload: mockHandleFileUpload,
};

it('renders the form', async () => {
  render(<DiscussionModal {...defaultProps} />);

  expect(await screen.findByText(/Start Discussion/i)).toBeVisible();
  expect(screen.getByRole('button', { name: /Send/i })).toBeVisible();
});

it('renders the attach files field', async () => {
  render(<DiscussionModal {...defaultProps} />);

  expect(await screen.findByText(/Attach files/i)).toBeVisible();
  expect(screen.getByText(/\(optional\)/i)).toBeVisible();
  expect(
    screen.getByText(
      /Add any files related to this discussion. The file size must not exceed 100 MB./i,
    ),
  ).toBeVisible();
});

it('renders error message when file size exceeds 100 MB', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const fileInput = screen.getByLabelText(/Attach File/i, {
    selector: 'input[type="file"]',
  });
  const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

  Object.defineProperty(mockFile, 'size', { value: 101 * 1024 * 1024 });

  await userEvent.upload(fileInput, mockFile);
  await userEvent.tab();

  await waitFor(() => {
    expect(
      screen.getByText(
        /The file size exceeds the limit of 100 MB. Please upload a smaller file./i,
      ),
    ).toBeInTheDocument();
  });
});

it('removes uploaded file', async () => {
  const uploadedFile = {
    id: 'file-to-remove',
    filename: 'remove-me.pdf',
    url: 'https://example.com/remove-me.pdf',
  };
  const handleFileUpload = jest.fn(() => Promise.resolve(uploadedFile));

  render(
    <DiscussionModal {...defaultProps} handleFileUpload={handleFileUpload} />,
  );

  const fileInput = screen.getByLabelText(/Attach File/i, {
    selector: 'input[type="file"]',
  });
  const mockFile = new File(['test'], 'remove-me.pdf', {
    type: 'application/pdf',
  });

  await userEvent.upload(fileInput, mockFile);

  await waitFor(() => {
    expect(screen.getByText('remove-me.pdf')).toBeInTheDocument();
  });

  await userEvent.click(screen.getByRole('button', { name: /cross/i }));

  await waitFor(() => {
    expect(screen.queryByText('remove-me.pdf')).not.toBeInTheDocument();
  });
});

it('displays error message when file upload fails', async () => {
  const handleFileUpload = jest.fn(
    (_file, _fileType, handleError: (errorMessage: string) => void) => {
      handleError('Upload failed');
      return Promise.resolve(undefined);
    },
  );

  render(
    <DiscussionModal {...defaultProps} handleFileUpload={handleFileUpload} />,
  );

  const fileInput = screen.getByLabelText(/Attach File/i, {
    selector: 'input[type="file"]',
  });
  const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

  await userEvent.upload(fileInput, mockFile);

  await waitFor(() => {
    expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
  });
});

it('data is sent on form submission', async () => {
  const onSave = jest.fn().mockResolvedValue(undefined);
  const uploadedFile = {
    id: 'uploaded-file-id',
    filename: 'document.pdf',
    url: 'https://example.com/document.pdf',
  };
  const handleFileUpload = jest.fn(() => Promise.resolve(uploadedFile));

  render(
    <DiscussionModal
      {...defaultProps}
      onSave={onSave}
      handleFileUpload={handleFileUpload}
    />,
  );

  const titleInput = screen.getByRole('textbox', { name: /Title/i });
  await userEvent.type(titleInput, 'test title');

  const textInput = screen.getByTestId('editor');
  await userEvent.click(textInput);
  await userEvent.tab();
  fireEvent.input(textInput, { data: 'test message' });
  await userEvent.tab();

  const fileInput = screen.getByLabelText(/Attach File/i, {
    selector: 'input[type="file"]',
  });
  const mockFile = new File(['test'], 'document.pdf', {
    type: 'application/pdf',
  });

  await userEvent.upload(fileInput, mockFile);

  await waitFor(() => {
    const shareButton = screen.getByRole('button', { name: /Send/i });
    expect(shareButton).toBeEnabled();
  });

  const shareButton = screen.getByRole('button', { name: /Send/i });
  await userEvent.click(shareButton);

  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({
      title: 'test title',
      text: 'test message',
      files: [uploadedFile],
    });
  });
});

it('send button is disabled when title is not provided', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const sendButton = screen.getByRole('button', { name: /Send/i });
  expect(sendButton).toBeDisabled();

  const textInput = screen.getByTestId('editor');
  await userEvent.click(textInput);
  await userEvent.tab();
  fireEvent.input(textInput, { data: 'test message' });
  await userEvent.tab();

  await waitFor(() => {
    expect(sendButton).toBeDisabled();
  });
});

it('send button is disabled when text is not provided', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const sendButton = screen.getByRole('button', { name: /Send/i });
  expect(sendButton).toBeDisabled();

  const titleInput = screen.getByRole('textbox', { name: /Title/i });
  await userEvent.type(titleInput, 'test title');

  await waitFor(() => {
    expect(sendButton).toBeDisabled();
  });
});

it('send button is disabled when uploading files', async () => {
  const uploadedFile = {
    id: 'file-id',
    filename: 'test.pdf',
    url: 'https://example.com/test.pdf',
  };
  let resolveUpload!: (value: typeof uploadedFile) => void;
  const handleFileUpload = jest.fn(
    () =>
      new Promise<typeof uploadedFile>((resolve) => {
        resolveUpload = resolve;
      }),
  );

  render(
    <DiscussionModal {...defaultProps} handleFileUpload={handleFileUpload} />,
  );

  const titleInput = screen.getByRole('textbox', { name: /Title/i });
  await userEvent.type(titleInput, 'test title');

  const textInput = screen.getByTestId('editor');
  await userEvent.click(textInput);
  await userEvent.tab();
  fireEvent.input(textInput, { data: 'test message' });
  await userEvent.tab();

  const fileInput = screen.getByLabelText(/Attach File/i, {
    selector: 'input[type="file"]',
  });
  const mockFile = new File(['test'], 'test.pdf', {
    type: 'application/pdf',
  });

  expect(screen.queryByText(/test.pdf/i)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Send/i })).toBeEnabled();

  const uploadPromise = userEvent.upload(fileInput, mockFile);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Send/i })).toBeDisabled();
  });

  resolveUpload(uploadedFile);
  await uploadPromise;

  await waitFor(() => {
    expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
  });

  expect(screen.getByRole('button', { name: /Send/i })).toBeEnabled();
});

it('displays error message when title is bigger than 100 characters', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const titleInput = screen.getByRole('textbox', { name: /Title/i });
  await userEvent.type(
    titleInput,
    'test title, test title, test title, test title, test title, test title, test title, test title, test title',
  );
  await userEvent.tab();

  await waitFor(() => {
    expect(
      screen.getAllByText(/Title cannot exceed 100 characters./i).length,
    ).toBeGreaterThanOrEqual(1);
  });
});

it('displays cancellation confirmation on cancel', async () => {
  render(<DiscussionModal {...defaultProps} />);

  const cancelButton = await screen.findByRole('button', { name: /Cancel/i });
  await userEvent.click(cancelButton);

  const cancellationText = await screen.findByText(
    /Cancelling now will result in the loss of all entered data./,
  );

  await waitFor(() => {
    expect(cancellationText).toBeVisible();
  });
});
