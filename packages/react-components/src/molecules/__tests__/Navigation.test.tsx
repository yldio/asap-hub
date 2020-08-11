import React from 'react';

import { render } from '@testing-library/react';

import Navigation from '../Navigation';

it('renders the navigation sidebar', () => {
  const { getAllByRole } = render(<Navigation />);

  const links = getAllByRole('link');
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    '/users',
    '/teams',
  ]);
  expect(links.map((link) => link.textContent)).toEqual(['Users', 'Teams']);
});
