import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import {
  createGroupResponse,
  createListGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';

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
  ).toMatchInlineSnapshot(`"Phillip’s Groups"`);
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
          id: 'g1',
        },
      ]}
    />,
  );

  expect(getByRole('link').textContent).toEqual('Group 1');
  expect(getByRole('link').getAttribute('href')).toMatch(/g1$/);
});

it('renders a list of groups', () => {
  const { getAllByRole } = render(
    <UserProfileGroups {...props} groups={createListGroupResponse(3).items} />,
  );

  expect(getAllByRole('listitem').length).toEqual(3);
});

it('displays member role when not defined as leader', () => {
  const group = createGroupResponse();
  const { getByRole } = render(
    <UserProfileGroups
      {...props}
      id="12"
      groups={[
        {
          ...group,
          leaders: [
            {
              ...group.leaders[0],
              role: 'Project Manager',
              user: {
                ...createUserResponse(),
                id: '13',
              },
            },
          ],
        },
      ]}
    />,
  );

  expect(getByRole('listitem').textContent).toMatch(/member/i);
  expect(getByRole('listitem').textContent).not.toMatch(/project manager/i);
});

it('displays member role when defined as leader', () => {
  const group = createGroupResponse();
  const { getByRole } = render(
    <UserProfileGroups
      {...props}
      id={'12'}
      groups={[
        {
          ...group,
          leaders: [
            {
              ...group.leaders[0],
              role: 'Project Manager',
              user: {
                ...createUserResponse(),
                id: '12',
              },
            },
          ],
        },
      ]}
    />,
  );

  expect(getByRole('listitem').textContent).not.toMatch(/member/i);
  expect(getByRole('listitem').textContent).toMatch(/project manager/i);
});
