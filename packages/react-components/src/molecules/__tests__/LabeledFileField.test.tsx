import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { LabeledFileField } from '../..';

const handleFileUploadMock: jest.MockedFunction<
  ComponentProps<typeof LabeledFileField>['handleFileUpload']
> = jest.fn();

it('renders a labeled button when no file is selected', () => {
  render(
    <LabeledFileField
      title="Title"
      subtitle="Subtitle"
      description="Description"
      handleFileUpload={handleFileUploadMock}
    ></LabeledFileField>,
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
    ></LabeledFileField>,
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
    ></LabeledFileField>,
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
