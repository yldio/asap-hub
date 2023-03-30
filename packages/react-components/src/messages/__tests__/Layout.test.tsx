import { render, screen } from '@testing-library/react';

import Layout from '../Layout';

it('renders its children', () => {
  render(<Layout appOrigin="https://hub.asap.science">text</Layout>);
  expect(screen.getByText('text')).toBeVisible();
});

it('generates the terms link', () => {
  render(<Layout appOrigin="https://hub.asap.science">text</Layout>);
  expect(screen.getByRole('link', { name: /terms/i })).toBeVisible();
});

it('generates the privacy link', () => {
  render(<Layout appOrigin="https://hub.asap.science">text</Layout>);
  expect(screen.getByRole('link', { name: /privacy/i })).toBeVisible();
});
