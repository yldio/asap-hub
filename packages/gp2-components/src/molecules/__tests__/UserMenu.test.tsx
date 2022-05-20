import { render } from '@testing-library/react';
import UserMenu from '../UserMenu';

describe('UserMenu', () => {
  it('renders the navigation items', () => {
    const { getAllByRole } = render(<UserMenu />);
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([expect.stringMatching(/log.*out/i)]);
  });
});
