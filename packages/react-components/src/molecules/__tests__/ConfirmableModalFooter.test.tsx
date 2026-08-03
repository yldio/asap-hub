import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmableModalFooter from '../ConfirmableModalFooter';

const defaultProps = {
  confirmationMessage: 'You will lose your changes.',
  onKeepEditing: jest.fn(),
  onDiscard: jest.fn(),
  onCancel: jest.fn(),
  confirmLabel: 'Save',
  onConfirm: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ConfirmableModalFooter', () => {
  it('Should render the cancel and confirm actions with default enabled state', async () => {
    render(<ConfirmableModalFooter isConfirming={false} {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('Should render the discard confirmation when confirming', async () => {
    render(<ConfirmableModalFooter isConfirming {...defaultProps} />);

    expect(screen.getByText('You will lose your changes.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Keep Editing' }));
    expect(defaultProps.onKeepEditing).toHaveBeenCalledTimes(1);

    await userEvent.click(
      screen.getByRole('button', { name: 'Discard changes' }),
    );
    expect(defaultProps.onDiscard).toHaveBeenCalledTimes(1);
  });

  it('Should disable the confirm action and the cancel action when requested', () => {
    render(
      <ConfirmableModalFooter
        isConfirming={false}
        {...defaultProps}
        cancelEnabled={false}
        confirmEnabled={false}
        confirmLoading
      />,
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
