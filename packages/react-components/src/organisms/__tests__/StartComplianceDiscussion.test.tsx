import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-test-renderer';
import StartComplianceDiscussion from '../StartDiscussionModal';

const renderStartComplianceDiscussion = async (props: any) => {
  render(<StartComplianceDiscussion {...props} />);
  await waitFor(() => screen.queryByText(/loading/i));
};

describe('StartComplianceDiscussion', () => {
  const onSave = jest.fn();
  const onDismiss = jest.fn();
  const complianceReportId = 'test-id';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  it('renders the modal correctly', async () => {
    await renderStartComplianceDiscussion({
      onDismiss,
      complianceReportId,
      onSave,
    });

    expect(screen.getByText('Start a discussion')).toBeInTheDocument();
    expect(screen.getByText('Please provide details')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('validates the form fields', async () => {
    await renderStartComplianceDiscussion({
      onDismiss,
      complianceReportId,
      onSave,
    });

    fireEvent.click(screen.getByText('Send'));

    expect(screen.getByText('Please provide details')).toBeInTheDocument();
  });

  it('send button is enabled when discussion text is provided', async () => {
    await renderStartComplianceDiscussion({
      onDismiss,
      complianceReportId,
      onSave,
    });

    const sendButton = screen.getByRole('button', { name: /Send/i });

    expect(sendButton).toBeDisabled();

    const editor = screen.getByTestId('editor');
    await act(async () => {
      userEvent.click(editor);
      userEvent.tab();
      fireEvent.input(editor, { data: 'test discussion' });
      userEvent.tab();
    });

    expect(sendButton).toBeEnabled();
  });

  it('calls onSave with correct arguments when form is submitted', async () => {
    await renderStartComplianceDiscussion({
      onDismiss,
      complianceReportId,
      onSave,
    });

    const message = 'Test message';

    const editor = screen.getByTestId('editor');
    await act(async () => {
      userEvent.click(editor);
      userEvent.tab();
      fireEvent.input(editor, { data: message });
      userEvent.tab();
    });

    fireEvent.click(screen.getByText('Send'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(complianceReportId, message);
    });
  });

  it('calls onDismiss when cancel button is clicked', async () => {
    await renderStartComplianceDiscussion({
      onDismiss,
      complianceReportId,
      onSave,
    });

    fireEvent.click(screen.getByText('Cancel'));

    expect(onDismiss).toHaveBeenCalled();
  });
});
