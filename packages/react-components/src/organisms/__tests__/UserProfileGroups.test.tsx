import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createGroupResponse } from '@asap-hub/fixtures';

import UserProfileGroups from '../UserProfileGroups';

const props: ComponentProps<typeof UserProfileGroups> = {
  firstName: '',
  id: '',
  groups: [],
};

it('render a heading', () => {
  const { getByText } = render(
    <UserProfileGroups {...props} firstName="Phillip" />,
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
      {...props}
      groups={[
        {
          ...createGroupResponse({}, 1),
          name: 'Group 1',
          href: '/network/groups/1',
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
      {...props}
      groups={Array.from({ length: 3 }).map((_, i) => ({
        ...createGroupResponse({}, i),
        href: '',
      }))}
    />,
  );

  expect(getAllByRole('listitem').length).toEqual(3);
});
