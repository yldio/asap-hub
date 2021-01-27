import React from 'react';
import { number, boolean } from '@storybook/addon-knobs';
import { MembersList } from '@asap-hub/react-components';
import { createListUserResponse } from '@asap-hub/fixtures';

export default {
  title: 'Molecules / Profile / Members List',
  component: MembersList,
};

export const Normal = () => (
  <MembersList
    singleColumn={boolean('Force Single Column', false)}
    members={createListUserResponse(
      number('Number of members', 6),
    ).items.map((member) => ({ ...member, href: '#', teams: [] }))}
  />
);

export const WithTeam = () => (
  <MembersList
    singleColumn={boolean('Force Single Column', false)}
    members={createListUserResponse(number('Number of members', 6)).items.map(
      (member) => ({
        ...member,
        href: '#',
        teams: Array(number('Number of teams', 1))
          .fill(null)
          .map((_, i) => ({ displayName: `Team ${i + 1}`, href: '#' })),
      }),
    )}
  />
);
