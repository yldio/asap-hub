import React, { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import NetworkPageHeader from '../NetworkPageHeader';

const props: ComponentProps<typeof NetworkPageHeader> = {
  page: 'teams',
  usersHref: '/users',
  teamsHref: '/teams',

  searchQuery: '',
};
it('renders the header', () => {
  const { getByRole } = render(<NetworkPageHeader {...props} />);
  expect(getByRole('heading')).toBeVisible();
});

it('Displays relevant page information', () => {
  const { getByText, getByRole, rerender } = render(
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
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, method, …"`);

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
  expect(
    (getByRole('searchbox') as HTMLInputElement).placeholder,
  ).toMatchInlineSnapshot(`"Enter name, keyword, institution, …"`);
});

it('renders the tab links', async () => {
  const { getByText } = render(
    <NetworkPageHeader {...props} usersHref="/users" teamsHref="/teams" />,
  );
  expect(
    getByText(/people/i, { selector: 'nav a *' }).closest('a'),
  ).toHaveAttribute('href', '/users');
  expect(
    getByText(/teams/i, { selector: 'nav a *' }).closest('a'),
  ).toHaveAttribute('href', '/teams');
});

it('Passes query correctly', () => {
  const { getByRole } = render(
    <NetworkPageHeader {...props} searchQuery={'test123'} />,
  );
  expect((getByRole('searchbox') as HTMLInputElement).value).toEqual('test123');
});
