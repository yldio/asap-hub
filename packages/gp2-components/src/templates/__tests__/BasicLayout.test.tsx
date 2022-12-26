import { render, screen } from '@testing-library/react';

import BasicLayout from '../BasicLayout';

it('renders the GP2 logo', () => {
  render(<BasicLayout>Content</BasicLayout>);
  expect(screen.getByRole('link').firstChild).toHaveTextContent(/GP2 Logo/);
});

it('renders an GP2 logo with specified href', () => {
  render(<BasicLayout logoHref={'http://example.com'}>Content</BasicLayout>);
  expect(screen.getByRole('link')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});

it('renders the content', async () => {
  render(<BasicLayout>Content</BasicLayout>);
  expect(screen.getByText('Content')).toBeVisible();
});
