import { render } from '@testing-library/react';
import MainNavigation from '../MainNavigation';

describe('MainNavigation', () => {
  it('renders the navigation items', () => {
    const { getAllByRole } = render(<MainNavigation />);
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      expect.stringMatching(/home/i),
      expect.stringMatching(/network/i),
    ]);
  });
});
