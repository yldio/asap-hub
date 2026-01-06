import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterModalFooter from '../FilterModalFooter';

describe('FilterModalFooter', () => {
  const defaultProps = {
    onApply: jest.fn(),
    onReset: jest.fn(),
    onClose: jest.fn(),
  };
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('renders the close, reset and apply buttons', () => {
    render(<FilterModalFooter {...defaultProps} />);
    expect(
      screen.getAllByRole('button').map((button) => button.textContent),
    ).toMatchObject(['Close', 'Reset', 'Apply']);
  });
  it('applies the function to the buttons', async () => {
    render(<FilterModalFooter {...defaultProps} />);
    await act(async () => {
      screen.getAllByRole('button').forEach(async (button) => {
        await userEvent.click(button);
      });
    });
    await waitFor(() => {
      expect(defaultProps.onApply).toHaveBeenCalledTimes(1);
      expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });
});
