import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import NavigationHeader from '../NavigationHeader';

describe('NavigationHeader', () => {
  const props: ComponentProps<typeof NavigationHeader> = {
    userId: '1',
    projects: [],
    workingGroups: [],
    menuShown: false,
    onToggleMenu: jest.fn(),
  };
  it('renders the gp2 logo', () => {
    render(<NavigationHeader {...props} />);
    expect(screen.getAllByRole('link')[0]?.firstChild).toHaveTextContent(
      /GP2 Logo/,
    );
  });

  it('renders a menu button if menuShown prop is false', () => {
    render(<NavigationHeader {...props} />);
    expect(screen.getByTitle(/menu/i)).toBeInTheDocument();
  });
  it('renders a close button if menuShown prop is true', () => {
    render(<NavigationHeader {...props} menuShown={true} />);
    expect(screen.getByTitle(/close/i)).toBeInTheDocument();
  });
  it('calls onMenuToggle when the menu toggle button is clicked', () => {
    const onMenuToggle = jest.fn();
    render(<NavigationHeader {...props} onToggleMenu={onMenuToggle} />);
    userEvent.click(screen.getByLabelText(/toggle menu/i));
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });
});
