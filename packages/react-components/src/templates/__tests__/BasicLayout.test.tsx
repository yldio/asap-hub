import { render } from '@testing-library/react';

import BasicLayout from '../BasicLayout';

it('renders an ASAP logo', () => {
  const { getByTitle, getByRole } = render(<BasicLayout>Content</BasicLayout>);
  expect(getByTitle('ASAP Logo')).toBeInTheDocument();
  expect(getByRole('link')).toHaveAttribute('href', '/');
});

it('renders an ASAP logo with specified href', () => {
  const { getByRole } = render(
    <BasicLayout logoHref={'http://google.com'}>Content</BasicLayout>,
  );
  expect(getByRole('link')).toHaveAttribute('href', 'http://google.com');
});

it('renders the content', async () => {
  const { getByText } = render(<BasicLayout>Content</BasicLayout>);
  expect(getByText('Content')).toBeVisible();
});
