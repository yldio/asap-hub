import { screen, render } from '@testing-library/react';
import MainNavigation from '../MainNavigation';

describe('MainNavigation', () => {
  it('renders the navigation items', () => {
    render(<MainNavigation />);
    expect(
      screen.getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      expect.stringMatching(/people/i),
      expect.stringMatching(/working groups/i),
      expect.stringMatching(/projects/i),
      expect.stringMatching(/outputs/i),
      expect.stringMatching(/events/i),
    ]);
  });
});
