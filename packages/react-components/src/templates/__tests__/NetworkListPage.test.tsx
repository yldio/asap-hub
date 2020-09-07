import React from 'react';
import { render } from '@testing-library/react';

import NetworkListPage from '../NetworkListPage';

it('renders the header', () => {
  const { getByRole } = render(<NetworkListPage>Content</NetworkListPage>);
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(<NetworkListPage>Content</NetworkListPage>);
  expect(getByText('Content')).toBeVisible();
});
