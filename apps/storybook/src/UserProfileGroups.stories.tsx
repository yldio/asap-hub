import React from 'react';
import { text, number } from '@storybook/addon-knobs';
import { UserProfileGroups } from '@asap-hub/react-components';

export default {
  title: 'Organisms / User Profile / Groups',
};

export const Normal = () => (
  <UserProfileGroups
    firstName={text('First Name', 'Daniel')}
    groups={Array(number('Number of Groups', 2))
      .fill(null)
      .map((_, groupIndex) => ({
        href: `#${groupIndex}`,
        name: `Group ${groupIndex + 1}`,
        role: groupIndex % 2 ? 'Leader' : 'Member',
      }))}
  />
);
