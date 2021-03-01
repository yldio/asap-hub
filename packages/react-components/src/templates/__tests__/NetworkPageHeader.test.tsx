import React, { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import NetworkPageHeader from '../NetworkPageHeader';

const props: ComponentProps<typeof NetworkPageHeader> = {
  page: 'teams',
  usersHref: '/users',
  teamsHref: '/teams',
  groupsHref: '/groups',

  searchQuery: '',
};
it('renders the header', () => {
  const { getByRole } = render(<NetworkPageHeader {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('alters the search placeholder based on the tab', () => {
  const { getByRole, rerender } = render(
    <MemoryRouter initialEntries={['/current']}>
      <NetworkPageHeader {...props} page="teams" teamsHref="/current" />
    </MemoryRouter>,
  );
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

  rerender(
    <MemoryRouter initialEntries={['/current']}>
      <NetworkPageHeader {...props} page="users" usersHref="/current" />
    </MemoryRouter>,
  );
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);

  rerender(
    <MemoryRouter initialEntries={['/current']}>
      <NetworkPageHeader {...props} page="groups" groupsHref="/current" />
    </MemoryRouter>,
  );
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Search for a group…"`);
});

it('shows the filter only on the users tab', () => {
  const { getByText, queryByText, rerender } = render(
    <MemoryRouter initialEntries={['/current']}>
      <NetworkPageHeader {...props} page="teams" teamsHref="/current" />
    </MemoryRouter>,
  );
  expect(queryByText(/filters/i)).not.toBeInTheDocument();

  rerender(
    <MemoryRouter initialEntries={['/current']}>
      <NetworkPageHeader {...props} page="users" usersHref="/current" />
    </MemoryRouter>,
  );
  expect(getByText(/filters/i)).toBeInTheDocument();
});

it('highlights the current tab', () => {
  const { getByText, rerender } = render(
    <MemoryRouter initialEntries={['/current']}>
      <NetworkPageHeader {...props} page="teams" teamsHref="/current" />
    </MemoryRouter>,
  );
  expect(
    findParentWithStyle(
      getByText(/teams/i, { selector: 'nav a *' }),
      'fontWeight',
    )!.fontWeight,
  ).toBe('bold');
  expect(
    findParentWithStyle(
      getByText(/people/i, { selector: 'nav a *' }),
      'fontWeight',
    )?.fontWeight,
  ).not.toBe('bold');

  rerender(
    <MemoryRouter initialEntries={['/current']}>
      <NetworkPageHeader {...props} page="users" usersHref="/current" />
    </MemoryRouter>,
  );
  expect(
    findParentWithStyle(
      getByText(/teams/i, { selector: 'nav a *' }),
      'fontWeight',
    )?.fontWeight,
  ).not.toBe('bold');
  expect(
    findParentWithStyle(
      getByText(/people/i, { selector: 'nav a *' }),
      'fontWeight',
    )!.fontWeight,
  ).toBe('bold');
});

it('renders the tab links', async () => {
  const { getByText } = render(
    <NetworkPageHeader
      {...props}
      usersHref="/users"
      teamsHref="/teams"
      groupsHref="/groups"
    />,
  );
  expect(
    getByText(/people/i, { selector: 'nav a *' }).closest('a'),
  ).toHaveAttribute('href', '/users');
  expect(
    getByText(/teams/i, { selector: 'nav a *' }).closest('a'),
  ).toHaveAttribute('href', '/teams');
  expect(
    getByText(/groups/i, { selector: 'nav a *' }).closest('a'),
  ).toHaveAttribute('href', '/groups');
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <NetworkPageHeader {...props} searchQuery={'test123'} />,
  );
  expect((getByRole('searchbox') as HTMLInputElement).value).toEqual('test123');
});
