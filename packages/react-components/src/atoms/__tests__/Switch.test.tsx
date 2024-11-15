import { ThemeProvider } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';

import { color } from '../../colors';
import Switch from '../Switch';

const props: ComponentProps<typeof Switch> = {
  onClick: jest.fn(),
};

describe('Switch', () => {
  it('renders the switch as a checkbox', () => {
    render(<Switch {...props} />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const customProps = {
      id: 'test-switch',
      checked: true,
      enabled: false,
      ariaLabel: 'Custom label',
    };

    render(<Switch {...props} {...customProps} />);

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toHaveAttribute('id', 'test-switch');
    expect(switchElement).toBeChecked();
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveAttribute('aria-label', 'Custom label');
  });

  it('uses noop function when no onClick is provided', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('checkbox');

    // This test ensures the component doesn't throw when clicked without an onClick handler
    expect(() => {
      userEvent.click(switchElement);
    }).not.toThrow();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    render(<Switch {...props} onClick={mockOnClick} />);

    const switchElement = screen.getByLabelText('Toggle switch');
    userEvent.click(switchElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick handler when disabled', () => {
    const mockOnClick = jest.fn();
    render(<Switch {...props} onClick={mockOnClick} enabled={false} />);

    const switchElement = screen.getByLabelText('Toggle switch');
    userEvent.click(switchElement);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('uses ThemeProvider theme primaryColor', () => {
    const testCheckedBackgroundColor = color(0, 106, 146);
    const theme = {
      colors: {
        primary500: testCheckedBackgroundColor,
      },
    };
    render(
      <ThemeProvider theme={theme}>
        <Switch {...props} checked />
      </ThemeProvider>,
    );

    const switchElement = screen.getByLabelText('Toggle switch');

    const { backgroundColor: checkedBackgroundColor } = getComputedStyle(
      switchElement,
      ':checked',
    );

    expect(checkedBackgroundColor).toBe(testCheckedBackgroundColor.rgb);
  });
});
