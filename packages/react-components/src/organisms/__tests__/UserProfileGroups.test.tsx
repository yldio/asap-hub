import React from 'react';
import { render } from '@testing-library/react';
import UserProfileGroups from '../UserProfileGroups';

it('render a heading', () => {
  const { getByText } = render(
    <UserProfileGroups firstName="Phillip" groups={[]} />,
  );

  expect(
    getByText(/phillip/i, { selector: 'h2' }).textContent,
  ).toMatchInlineSnapshot(`"Phillip’ Groups"`);
  expect(
    getByText(/phillip/i, { selector: 'p' }).textContent,
  ).toMatchInlineSnapshot(
    `"Phillip’s team is collaborating with other teams via groups, which meet frequently"`,
  );
});

it('renders one group', () => {
  const { getByRole } = render(
    <UserProfileGroups
      firstName="Phillip"
      groups={[
        {
          name: 'Group 1',
          href: '/network/groups/1',
          role: 'Chair',
        },
      ]}
    />,
  );

  expect(getByRole('link').textContent).toEqual('Group 1');
  expect(getByRole('link').getAttribute('href')).toEqual('/network/groups/1');
});

it('renders a list of groups', () => {
  const { getAllByRole } = render(
    <UserProfileGroups
      firstName="Phillip"
      groups={[
        {
          name: 'Group 1',
          href: '/network/groups/1',
          role: 'Member',
        },
        {
          name: 'Group 2',
          href: '/network/groups/1',
          role: 'Project Manager',
        },
        {
          name: 'Group 3',
          href: '/network/groups/1',
          role: 'Chair',
        },
      ]}
    />,
  );

  expect(getAllByRole('listitem').length).toEqual(3);
});
