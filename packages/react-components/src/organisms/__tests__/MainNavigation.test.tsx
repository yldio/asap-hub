import React from 'react';

import { render } from '@testing-library/react';

import MainNavigation from '../MainNavigation';

it('renders the navigation sidebar', () => {
  const { getAllByRole } = render(<MainNavigation />);

  const links = getAllByRole('link');
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    '/users',
    '/teams',
  ]);
  expect(links.map((link) => link.textContent)).toEqual(['Users', 'Teams']);
});
