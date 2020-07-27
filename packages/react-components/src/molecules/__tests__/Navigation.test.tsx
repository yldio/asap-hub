import React from 'react';
import { render } from '@testing-library/react';

import Navigation from '../Navigation';

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<Navigation />);
  expect(getByAltText(/asap.+logo/i)).toHaveAttribute(
    'src',
    expect.stringMatching(/asap/i),
  );
});

it('renders a link to relevant pages', () => {
  const { getAllByRole } = render(<Navigation />);
  const links = getAllByRole('link');
  expect(links.map((link) => link.getAttribute('href'))).toEqual([
    '/users',
    '/teams',
  ]);
  expect(links.map((link) => link.textContent)).toEqual(['Users', 'Teams']);
});
