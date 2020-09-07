import React from 'react';
import { render } from '@testing-library/react';

import BasicLayout from '../BasicLayout';

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<BasicLayout>Content</BasicLayout>);
  expect(getByAltText(/asap.+logo/i)).toBeVisible();
});

it('renders the content', async () => {
  const { getByText } = render(<BasicLayout>Content</BasicLayout>);
  expect(getByText('Content')).toBeVisible();
});
