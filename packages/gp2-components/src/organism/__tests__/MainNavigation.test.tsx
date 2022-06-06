import { screen, render } from '@testing-library/react';
import MainNavigation from '../MainNavigation';

describe('MainNavigation', () => {
  it('renders the navigation items', () => {
    render(<MainNavigation />);
    expect(
      screen.getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      expect.stringMatching(/home/i),
      expect.stringMatching(/network/i),
    ]);
  });
});
