import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import ConfirmStatusChangeModal from '../ConfirmStatusChangeModal';

const renderModal = (children: ReactNode) =>
  render(<MemoryRouter>{children}</MemoryRouter>);

describe('ConfirmStatusChangeModal', () => {
  beforeEach(jest.clearAllMocks);

  afterAll(jest.clearAllMocks);

  const defaultProps: ComponentProps<typeof ConfirmStatusChangeModal> = {
    onConfirm: jest.fn(),
    onDismiss: jest.fn(),
    newStatus: 'Manuscript Resubmitted',
  };

  it.each`
    newStatus                        | title                                                           | content                                             | submissionButtonText
    ${'Waiting for Report'}          | ${'Update status and notify?'}                                  | ${'By updating the compliance status,'}             | ${'Update Status and Notify'}
    ${'Review Compliance Report'}    | ${'Update status and notify?'}                                  | ${'By updating the compliance status,'}             | ${'Update Status and Notify'}
    ${'Waiting for ASAP Reply'}      | ${'Update status and notify?'}                                  | ${'By updating the compliance status,'}             | ${'Update Status and Notify'}
    ${"Waiting for Grantee's Reply"} | ${'Update status and notify?'}                                  | ${'By updating the compliance status,'}             | ${'Update Status and Notify'}
    ${'Manuscript Resubmitted'}      | ${'Update status and notify?'}                                  | ${'By updating the compliance status,'}             | ${'Update Status and Notify'}
    ${'Submit Final Publication'}    | ${'Update status and notify?'}                                  | ${'By updating the compliance status,'}             | ${'Update Status and Notify'}
    ${'Addendum Required'}           | ${'Update status and notify?'}                                  | ${'By updating the compliance status,'}             | ${'Update Status and Notify'}
    ${'Compliant'}                   | ${'Set status to compliant? This action is irreversible.'}      | ${'After you update the status to compliant,'}      | ${'Set to Compliant and Notify'}
    ${'Closed (other)'}              | ${'Set status to closed (other)? This action is irreversible.'} | ${'After you update the status to closed (other),'} | ${'Set to Closed (other) and Notify'}
  `(
    'when newStatus is $newStatus, it should render the title as $title, content contains $content and submit button as $submissionButtonText',
    ({ newStatus, title, content, submissionButtonText }) => {
      const { container, getByRole, getByText } = renderModal(
        <ConfirmStatusChangeModal {...defaultProps} newStatus={newStatus} />,
      );

      expect(getByText(title, { selector: 'h3' })).toHaveTextContent(title);
      expect(container.textContent).toContain(content);
      expect(
        getByRole('button', { name: submissionButtonText }),
      ).toBeInTheDocument();
    },
  );

  it('calls onDismiss when user clicks on "Cancel" button', () => {
    const onDismiss = jest.fn();

    renderModal(
      <ConfirmStatusChangeModal {...defaultProps} onDismiss={onDismiss} />,
    );

    userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss when user clicks on "Close" button', () => {
    const onDismiss = jest.fn();

    renderModal(
      <ConfirmStatusChangeModal {...defaultProps} onDismiss={onDismiss} />,
    );

    userEvent.click(screen.getByTitle(/close/i));

    expect(onDismiss).toHaveBeenCalled();
  });

  it.each`
    newStatus                        | submissionButtonText
    ${'Waiting for Report'}          | ${'Update Status and Notify'}
    ${'Review Compliance Report'}    | ${'Update Status and Notify'}
    ${'Waiting for ASAP Reply'}      | ${'Update Status and Notify'}
    ${"Waiting for Grantee's Reply"} | ${'Update Status and Notify'}
    ${'Manuscript Resubmitted'}      | ${'Update Status and Notify'}
    ${'Submit Final Publication'}    | ${'Update Status and Notify'}
    ${'Addendum Required'}           | ${'Update Status and Notify'}
    ${'Compliant'}                   | ${'Set to Compliant and Notify'}
    ${'Closed (other)'}              | ${'Set to Closed (other) and Notify'}
  `(
    'calls onConfirm when newStatus is $newStatus and user clicks on submit button',
    async ({ newStatus, submissionButtonText }) => {
      const onConfirm = jest.fn();

      const { getByRole } = renderModal(
        <ConfirmStatusChangeModal
          {...defaultProps}
          newStatus={newStatus}
          onConfirm={onConfirm}
        />,
      );

      userEvent.click(getByRole('button', { name: submissionButtonText }));

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalled();
      });
    },
  );

  it('disables button while the request is in progress', async () => {
    const onConfirm = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(resolve, 200);
        }),
    );
    const onDismiss = jest.fn();

    const { getByRole } = renderModal(
      <ConfirmStatusChangeModal
        {...defaultProps}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
      />,
    );
    const submitButton = getByRole('button', {
      name: 'Update Status and Notify',
    });

    expect(submitButton).not.toBeDisabled();

    userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    expect(onDismiss).toHaveBeenCalled();
  });
});
