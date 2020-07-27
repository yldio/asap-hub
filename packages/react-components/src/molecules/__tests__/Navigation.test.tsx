import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { render } from '@testing-library/react';

import Navigation from '../Navigation';

it('renders the navigation sidebar', () => {
  const { getByAltText, getAllByRole } = render(
    <MemoryRouter initialEntries={['/']}>
      <Route exact path="/" component={() => <Navigation />} />
    </MemoryRouter>,
  );

  expect(getByAltText(/asap.+logo/i)).toHaveAttribute(
    'src',
    expect.stringMatching(/asap/i),
  );

  const links = getAllByRole('link');
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    '/users',
    '/teams',
  ]);
  expect(links.map((link) => link.textContent)).toEqual(['Users', 'Teams']);
});
