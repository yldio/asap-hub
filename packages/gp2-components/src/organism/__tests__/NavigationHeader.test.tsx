import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationHeader from '../NavigationHeader';

describe('NavigationHeader', () => {
  it('renders the gp2 logo', () => {
    const { getAllByRole } = render(<NavigationHeader />);
    expect(
      getAllByRole('link')[0].querySelector('svg > title'),
    ).toHaveTextContent(/GP2 Logo/);
  });

  it('renders a menu button if menuOpen prop is false', () => {
    const { queryByTitle } = render(<NavigationHeader menuOpen={false} />);
    expect(queryByTitle(/menu/i)).toBeInTheDocument();
  });
  it('renders a close button if menuOpen prop is true', () => {
    const { queryByTitle } = render(<NavigationHeader menuOpen={true} />);
    expect(queryByTitle(/close/i)).toBeInTheDocument();
  });
  it('calls onMenuToggle when the menu toggle button is clicked', () => {
    const onMenuToggle = jest.fn();
    const { getByLabelText } = render(
      <NavigationHeader onToggleMenu={onMenuToggle} />,
    );
    userEvent.click(getByLabelText(/toggle menu/i));
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });
});
