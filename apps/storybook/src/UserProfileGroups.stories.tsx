import React from 'react';
import { text, array } from '@storybook/addon-knobs';
import { UserProfileGroups } from '@asap-hub/react-components';

export default {
  title: 'Organisms / User Profile / Groups',
};

export const Normal = () => (
  <UserProfileGroups
    firstName={text('First Name', 'Daniel')}
    groups={[
      { id: '1', name: 'Sci 1 - GWAS Functional', role: 'Member' },
      { id: '2', name: 'Sci 2 - Aging and Progression', role: 'Leader' },
    ]}
  />
);
