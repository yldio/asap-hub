import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { LabeledFileField } from '../..';

const handleFileUploadMock: jest.MockedFunction<
  ComponentProps<typeof LabeledFileField>['handleFileUpload']
> = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

it('renders a labeled button when no file is selected', () => {
  render(
    <LabeledFileField
      title="Title"
      subtitle="Subtitle"
      description="Description"
      handleFileUpload={handleFileUploadMock}
    />,
  );
  expect(screen.getByLabelText(/Title/i)).toBeVisible();
  expect(screen.getByLabelText(/Subtitle/i)).toBeVisible();
  expect(screen.getByLabelText(/Description/i)).toBeVisible();
  expect(screen.getByRole('button', { name: 'Add File' })).toBeVisible();
});

it('renders a file tag and a disabled button when a file is selected', () => {
  render(
    <LabeledFileField
      title="Title"
      subtitle="Subtitle"
      handleFileUpload={handleFileUploadMock}
      currentFile={{
        filename: 'file.txt',
        url: 'http://example.com/file.txt',
        id: '123',
      }}
    />,
  );
  expect(screen.getByText('file.txt')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Add File' })).toBeDisabled();
});

it('calls handleFileUpload when a file is selected', async () => {
  render(
    <LabeledFileField
      title="Title"
      subtitle="Subtitle"
      handleFileUpload={handleFileUploadMock}
      placeholder="Upload Manuscript File"
    />,
  );
  const testFile = new File(['file content'], 'file.txt', {
    type: 'text/plain',
  });
  const uploadInput = screen.getByLabelText(/Upload Manuscript File/i);

  userEvent.upload(uploadInput, testFile);

  await waitFor(() =>
    expect(handleFileUploadMock).toHaveBeenCalledWith(testFile),
  );
});

it('calls the onRemove function when the remove button is clicked and allows for resubmitting a new file', async () => {
  const onRemoveMock = jest.fn();
  render(
    <LabeledFileField
      title="Title"
      subtitle="Subtitle"
      handleFileUpload={handleFileUploadMock}
      onRemove={onRemoveMock}
      placeholder="Upload Manuscript File"
      currentFile={{
        filename: 'file.txt',
        url: 'http://example.com/file.txt',
        id: '123',
      }}
    />,
  );

  const testFile = new File(['file content'], 'file.txt', {
    type: 'text/plain',
  });
  const uploadInput = screen.getByLabelText(
    /Upload Manuscript File/i,
  ) as HTMLInputElement;

  userEvent.upload(uploadInput, testFile);

  expect(handleFileUploadMock).toHaveBeenCalledTimes(1);

  screen.getByRole('button', { name: /cross/i }).click();
  expect(onRemoveMock).toHaveBeenCalled();

  const differentFile = new File(['file content'], 'file.txt', {
    type: 'text/plain',
  });
  userEvent.upload(uploadInput, differentFile);
  expect(handleFileUploadMock).toHaveBeenCalledTimes(2);
});

it('trigger file upload when clicking on the add file button', async () => {
  const onRemoveMock = jest.fn();
  render(
    <LabeledFileField
      title="Title"
      subtitle="Subtitle"
      handleFileUpload={handleFileUploadMock}
      placeholder="Upload Manuscript File"
      onRemove={onRemoveMock}
      enabled
    />,
  );

  const addFileButton = screen.getByRole('button', { name: /add file/i });

  const uploadInput = screen.getByLabelText(/Upload Manuscript File/i);
  uploadInput.click = jest.fn();

  expect(addFileButton).toBeInTheDocument();
  await waitFor(() => {
    userEvent.click(addFileButton);
  });

  expect(uploadInput.click).toHaveBeenCalled();
});
