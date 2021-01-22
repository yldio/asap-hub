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
    members={createListUserResponse(number('Number of members', 6)).items}
  />
);

export const WithTeam = () => (
  <MembersList
    singleColumn={boolean('Force Single Column', false)}
    members={createListUserResponse(number('Number of members', 6)).items.map(
      (user) => ({
        ...user,
        team: { name: "Tom's Team", href: '#team' },
      }),
    )}
  />
);
