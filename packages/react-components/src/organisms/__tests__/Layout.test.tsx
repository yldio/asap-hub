import React from 'react';
import { render } from '@testing-library/react';

import Layout from '../Layout';

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<Layout>Content</Layout>);
  expect(getByAltText(/asap.+logo/i)).toBeVisible();
});

it('renders the content', async () => {
  const { getByText } = render(<Layout>Content</Layout>);
  expect(getByText('Content')).toBeVisible();
});

it('renders the content and sidebar', async () => {
  const { getByText, getAllByRole, rerender } = render(
    <Layout>Content</Layout>,
  );
  expect(getByText('Content')).toBeVisible();

  rerender(<Layout navigation>Content</Layout>);
  expect(getAllByRole('link').length).toBeGreaterThan(0);
});
