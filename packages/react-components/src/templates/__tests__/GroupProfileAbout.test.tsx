import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createGroupResponse, createUserResponse } from '@asap-hub/fixtures';

import GroupProfileAbout from '../GroupProfileAbout';

const props: ComponentProps<typeof GroupProfileAbout> = {
  ...createGroupResponse(),
  leaders: [],
  teams: [],
};

it('renders group information', () => {
  const { getByText } = render(
    <GroupProfileAbout {...props} description="Group Desc" />,
  );
  expect(getByText('Group Desc')).toBeVisible();
});

it('renders group tools', () => {
  const { getByText } = render(
    <GroupProfileAbout
      {...props}
      tools={{ slack: 'https://example.com/slack' }}
    />,
  );
  expect(getByText(/join slack/i).closest('a')).toHaveAttribute(
    'href',
    'https://example.com/slack',
  );
});

it('renders group members', () => {
  const { getByText } = render(
    <GroupProfileAbout
      {...props}
      leaders={[
        {
          user: {
            ...createUserResponse(),
            displayName: 'John',
            teams: [],
          },
          role: 'Chair',
          href: '',
        },
      ]}
    />,
  );
  expect(getByText('John')).toBeVisible();
});

it('assigns given id to the members section for deep linking', () => {
  const { container } = render(
    <GroupProfileAbout {...props} membersSectionId="members-section" />,
  );
  expect(container.querySelector('#members-section')).toHaveTextContent(
    /members/i,
  );
});
