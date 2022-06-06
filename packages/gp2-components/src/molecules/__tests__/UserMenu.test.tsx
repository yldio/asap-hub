import { render, screen } from '@testing-library/react';
import UserMenu from '../UserMenu';

describe('UserMenu', () => {
  it('renders the navigation items', () => {
    render(<UserMenu />);
    expect(
      screen.getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([expect.stringMatching(/log.*out/i)]);
  });
});
