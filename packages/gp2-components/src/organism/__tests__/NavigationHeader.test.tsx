import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationHeader from '../NavigationHeader';

describe('NavigationHeader', () => {
  it('renders the gp2 logo', () => {
    render(<NavigationHeader />);
    expect(screen.getAllByRole('link')[0]?.firstChild).toHaveTextContent(
      /GP2 Logo/,
    );
  });

  it('renders a menu button if menuOpen prop is false', () => {
    render(<NavigationHeader menuOpen={false} />);
    expect(screen.getByTitle(/menu/i)).toBeInTheDocument();
  });
  it('renders a close button if menuOpen prop is true', () => {
    render(<NavigationHeader menuOpen={true} />);
    expect(screen.getByTitle(/close/i)).toBeInTheDocument();
  });
  it('calls onMenuToggle when the menu toggle button is clicked', () => {
    const onMenuToggle = jest.fn();
    render(<NavigationHeader onToggleMenu={onMenuToggle} />);
    userEvent.click(screen.getByLabelText(/toggle menu/i));
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });
});
