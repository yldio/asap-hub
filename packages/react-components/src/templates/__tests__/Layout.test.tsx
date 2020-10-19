import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Layout from '../Layout';

const props: ComponentProps<typeof Layout> = {
  children: 'Content',
  discoverASAPHref: '/discover',
  libraryHref: '/library',
  networkHref: '/network',
  newsAndEventsHref: '/news-and-events',

  profileHref: '/profile',
  teams: [],
  settingsHref: '/settings',
  feedbackHref: '/feedback',
  logoutHref: '/logout',
  termsHref: '/terms',
  privacyPolicyHref: '/privacy-policy',
  aboutHref: '/about',
};

it('renders an ASAP logo', () => {
  const { getByAltText } = render(<Layout {...props} />);
  expect(getByAltText(/asap.+logo/i)).toBeVisible();
});

it('renders the main navigation', async () => {
  const { getAllByText } = render(<Layout {...props} />);
  expect(getAllByText(/network/i, { selector: 'nav *' })).not.toHaveLength(0);
});

it('renders the user navigation', async () => {
  const { getAllByText } = render(<Layout {...props} />);
  expect(getAllByText(/profile/i, { selector: 'nav *' })).not.toHaveLength(0);
});

it('renders the content', async () => {
  const { getByText } = render(<Layout {...props}>Content</Layout>);
  expect(getByText('Content')).toBeVisible();
});

it('renders a menu button that toggles the drawer', async () => {
  const { getByLabelText, queryByTitle } = render(<Layout {...props} />);
  expect(queryByTitle(/cross/i)).not.toBeInTheDocument();

  userEvent.click(getByLabelText(/toggle menu/i));
  expect(queryByTitle(/cross/i)).toBeInTheDocument();

  userEvent.click(getByLabelText(/toggle menu/i));
  expect(queryByTitle(/cross/i)).not.toBeInTheDocument();
});

it('renders a user menu button that toggles the drawer', async () => {
  const { getByLabelText } = render(<Layout {...props} />);
  expect(getByLabelText(/close/i)).not.toBeVisible();

  userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(getByLabelText(/close/i)).toBeVisible();

  userEvent.click(getByLabelText(/toggle.+user menu/i));
  expect(getByLabelText(/close/i)).not.toBeVisible();
});

it('closes the drawer when clicking the overlay', async () => {
  const { getByLabelText } = render(<Layout {...props} />);
  userEvent.click(getByLabelText(/toggle menu/i));

  userEvent.click(getByLabelText(/close/i));
  expect(getByLabelText(/close/i)).not.toBeVisible();
});

it('closes the drawer on navigation', async () => {
  const { getByLabelText, getAllByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <Layout {...props} />
    </MemoryRouter>,
  );
  userEvent.click(getByLabelText(/toggle menu/i));
  expect(getByLabelText(/close/i)).toBeVisible();

  userEvent.click(getAllByText(/network/i, { selector: 'nav *' })[0]);
  expect(getByLabelText(/close/i)).not.toBeVisible();
});
