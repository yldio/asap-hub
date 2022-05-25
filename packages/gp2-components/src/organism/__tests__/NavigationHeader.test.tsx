import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationHeader from '../NavigationHeader';

describe('NavigationHeader', () => {
  it('renders the gp2 logo', () => {
    const { queryAllByTitle } = render(<NavigationHeader />);
    queryAllByTitle(/gp2 logo/i).map((element) =>
      expect(element).toBeInTheDocument(),
    );
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
