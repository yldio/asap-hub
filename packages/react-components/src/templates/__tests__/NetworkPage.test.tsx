import React from 'react';
import { render } from '@testing-library/react';

import NetworkPage from '../NetworkPage';

it('renders the header', () => {
  const { getByRole } = render(<NetworkPage>Content</NetworkPage>);
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(<NetworkPage>Content</NetworkPage>);
  expect(getByText('Content')).toBeVisible();
});
