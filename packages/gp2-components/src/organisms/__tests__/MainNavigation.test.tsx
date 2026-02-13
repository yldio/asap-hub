import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainNavigation from '../MainNavigation';

describe('MainNavigation', () => {
  it('renders the navigation items', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MainNavigation />
      </MemoryRouter>,
    );
    expect(
      screen.getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      expect.stringMatching(/people/i),
      expect.stringMatching(/working groups/i),
      expect.stringMatching(/projects/i),
      expect.stringMatching(/outputs/i),
      expect.stringMatching(/events/i),
      expect.stringMatching(/news/i),
    ]);
  });
});
