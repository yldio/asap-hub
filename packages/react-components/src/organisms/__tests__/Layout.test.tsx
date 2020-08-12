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

it('renders the sidebar', async () => {
  const { container } = render(<Layout navigation>Content</Layout>);
  expect(container.querySelector('nav')).toBeInTheDocument();
});
