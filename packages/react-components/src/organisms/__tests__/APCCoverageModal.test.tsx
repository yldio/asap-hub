import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import APCCoverageModal from '../APCCoverageModal';

describe('APCCoverageModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const onConfirm = jest.fn();
  const onDismiss = jest.fn();

  const defaultProps: ComponentProps<typeof APCCoverageModal> = {
    onConfirm: jest.fn(),
    onDismiss: jest.fn(),
    apcRequested: true,
    apcAmountRequested: 3000,
    apcCoverageRequestStatus: 'paid',
    apcAmountPaid: 2500,
  };

  it('renders the modal with correct initial state', async () => {
    const { findByRole, getByRole } = render(
      <APCCoverageModal {...defaultProps} />,
    );

    expect(
      await findByRole('heading', { name: 'APC Coverage' }),
    ).toBeInTheDocument();

    expect(getByRole('radio', { name: 'Requested' })).toBeChecked();
    expect(getByRole('radio', { name: 'Paid' })).toBeChecked();
  });

  it('calls onDismiss when cancel button is clicked', async () => {
    const mockOnDismiss = jest.fn();
    const { findByRole, getByText } = render(
      <APCCoverageModal {...defaultProps} onDismiss={mockOnDismiss} />,
    );

    expect(
      await findByRole('heading', { name: 'APC Coverage' }),
    ).toBeInTheDocument();
    userEvent.click(getByText('Cancel'));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('displays Update button as disabled when required fields are not filled', async () => {
    const { findByRole, getByRole } = render(
      <APCCoverageModal onDismiss={onDismiss} onConfirm={onConfirm} />,
    );

    expect(
      await findByRole('heading', { name: 'APC Coverage' }),
    ).toBeInTheDocument();

    const updateButton = getByRole('button', { name: /Update/ });
    expect(updateButton).toBeDisabled();

    userEvent.click(getByRole('radio', { name: 'Not Requested' }));

    await waitFor(() => {
      expect(updateButton).toBeEnabled();
    });
  });

  it('submits declined reason when apc coverage request status is declined', async () => {
    const mockOnConfirm = jest.fn();
    const { getByRole, findByRole } = render(
      <APCCoverageModal
        onDismiss={onDismiss}
        onConfirm={mockOnConfirm}
        apcRequested={true}
        apcAmountRequested={3000}
        apcCoverageRequestStatus={'declined'}
        declinedReason={'declined reason'}
      />,
    );

    expect(
      await findByRole('heading', { name: 'APC Coverage' }),
    ).toBeInTheDocument();

    userEvent.click(getByRole('button', { name: /Update/ }));

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith({
        declinedReason: 'declined reason',
        apcAmountRequested: '3000',
        apcCoverageRequestStatus: 'declined',
        apcRequested: 'Requested',
      });
    });
  });

  it('submits amount paid when apc coverage request status is paid', async () => {
    const mockOnConfirm = jest.fn();
    const { getByRole, findByRole } = render(
      <APCCoverageModal
        onDismiss={onDismiss}
        onConfirm={mockOnConfirm}
        apcRequested={true}
        apcAmountRequested={3000}
        apcCoverageRequestStatus={'paid'}
        apcAmountPaid={3000}
      />,
    );

    expect(
      await findByRole('heading', { name: 'APC Coverage' }),
    ).toBeInTheDocument();

    userEvent.click(getByRole('button', { name: /Update/ }));

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledWith({
        apcAmountPaid: '3000',
        apcAmountRequested: '3000',
        apcCoverageRequestStatus: 'paid',
        apcRequested: 'Requested',
      });
    });
  });
});
