import { screen, render } from '@testing-library/react';
import MainNavigation from '../MainNavigation';

describe('MainNavigation', () => {
  it('renders the navigation items', () => {
    render(<MainNavigation />);
    expect(
      screen.getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      expect.stringMatching(/dashboard/i),
      expect.stringMatching(/users/i),
      expect.stringMatching(/working groups/i),
      expect.stringMatching(/projects/i),
    ]);
  });
});
