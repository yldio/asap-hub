import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Layout from '../Layout';

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<Layout>Content</Layout>);
  expect(getByAltText(/asap.+logo/i)).toBeVisible();
});

it('renders the main navigation', async () => {
  const { getByText } = render(<Layout>Content</Layout>);
  expect(getByText(/teams/i, { selector: 'nav *' })).toBeVisible();
});

it('renders the user navigation', async () => {
  const { getByText } = render(<Layout>Content</Layout>);
  expect(getByText(/user nav/i, { selector: 'nav *' })).toBeVisible();
});

it('renders the content', async () => {
  const { getByText } = render(<Layout>Content</Layout>);
  expect(getByText('Content')).toBeVisible();
});

it('renders a menu button that toggles the drawer', async () => {
  const { getByLabelText } = render(<Layout>Content</Layout>);
  expect(getByLabelText(/close/i)).not.toBeVisible();

  userEvent.click(getByLabelText(/toggle menu/i));
  expect(getByLabelText(/close/i)).toBeVisible();

  userEvent.click(getByLabelText(/toggle menu/i));
  expect(getByLabelText(/close/i)).not.toBeVisible();
});

it('renders a user menu button that toggles the drawer', async () => {
  const { getByLabelText } = render(<Layout>Content</Layout>);
  expect(getByLabelText(/close/i)).not.toBeVisible();

  userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(getByLabelText(/close/i)).toBeVisible();

  userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(getByLabelText(/close/i)).not.toBeVisible();
});

it('closes the drawer when clicking the overlay', async () => {
  const { getByLabelText } = render(<Layout>Content</Layout>);
  userEvent.click(getByLabelText(/toggle menu/i));

  userEvent.click(getByLabelText(/close/i));
  expect(getByLabelText(/close/i)).not.toBeVisible();
});

it('closes the drawer on navigation', async () => {
  const { getByLabelText, getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <Layout>Content</Layout>
    </MemoryRouter>,
  );
  userEvent.click(getByLabelText(/toggle menu/i));
  expect(getByLabelText(/close/i)).toBeVisible();

  userEvent.click(getByText(/teams/i, { selector: 'nav *' }));
  expect(getByLabelText(/close/i)).not.toBeVisible();
});
