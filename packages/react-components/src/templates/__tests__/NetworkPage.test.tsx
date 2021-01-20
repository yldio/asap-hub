import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NetworkPage from '../NetworkPage';

const props: ComponentProps<typeof NetworkPage> = {
  page: 'teams',
  usersHref: '/users',
  teamsHref: '/teams',
  groupsHref: '/groups',
  searchQuery: '',
};
it('renders the header', () => {
  const { getByRole } = render(<NetworkPage {...props}>Content</NetworkPage>);
  expect(getByRole('heading')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(<NetworkPage {...props}>Content</NetworkPage>);
  expect(getByText('Content')).toBeVisible();
});
