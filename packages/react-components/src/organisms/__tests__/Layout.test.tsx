import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import Layout from '../Layout';

const Component = (props: ComponentProps<typeof Layout>) => (
  <MemoryRouter initialEntries={['/']}>
    <Route exact path="/" component={() => <Layout {...props} />} />
  </MemoryRouter>
);

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<Component>Content</Component>);
  expect(getByAltText(/asap.+logo/i)).toBeVisible();
});

it('renders the content', async () => {
  const { getByText } = render(<Component>Content</Component>);
  expect(getByText('Content')).toBeVisible();
});

it('renders the content and sidebar', async () => {
  const { getByText, getAllByRole, rerender } = render(
    <Layout>Content</Layout>,
  );
  expect(getByText('Content')).toBeVisible();

  rerender(<Component navigation>Content</Component>);
  expect(getAllByRole('link').length).toBeGreaterThan(0);
});
