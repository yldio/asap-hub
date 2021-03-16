import React from 'react';
import { render } from '@testing-library/react';

import MainNavigation from '../MainNavigation';

it('renders the navigation items', () => {
  const { getAllByRole } = render(<MainNavigation />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringMatching(/network/i),
    expect.stringMatching(/research/i),
    expect.stringMatching(/news/i),
    expect.stringMatching(/calendar/i),
    expect.stringMatching(/discover/i),
  ]);
});
