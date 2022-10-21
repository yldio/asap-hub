import { render, screen } from '@testing-library/react';
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
    render(<FilterModalFooter {...defaultProps}></FilterModalFooter>);
    expect(
      screen.getAllByRole('button').map((button) => button.textContent),
    ).toMatchObject(['Close', 'Reset', 'Apply']);
  });
  it('applies the function to the buttons', () => {
    render(<FilterModalFooter {...defaultProps}></FilterModalFooter>);
    screen.getAllByRole('button').map((button) => userEvent.click(button));
    expect(defaultProps.onApply).toBeCalledTimes(1);
    expect(defaultProps.onReset).toBeCalledTimes(1);
    expect(defaultProps.onClose).toBeCalledTimes(1);
  });
});
