import React from 'react';
import { render } from '@testing-library/react';

import NotFoundPage from '../NotFoundPage';

it('renders a level 1 headline', () => {
  const { getByRole } = render(<NotFoundPage />);
  expect(getByRole('heading').tagName).toBe('H1');
});

it('links back to the root', () => {
  const { getByRole } = render(<NotFoundPage />);
  expect(getByRole('link')).toHaveAttribute('href', '/');
});
