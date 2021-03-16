import React from 'react';
import { text } from '@storybook/addon-knobs';
import { UserProfileBackground } from '@asap-hub/react-components';
import { TeamRole } from '@asap-hub/model';

export default {
  title: 'Organisms / User Profile / Background',
};

export const Normal = () => (
  <UserProfileBackground
    id="42"
    displayName={text('Display Name', 'John Doe')}
    firstName={text('First Name', 'John')}
    role={text('Role', 'Researcher') as TeamRole}
    approach={text('Approach', '')}
    responsibilities={text('Responsibilities', '')}
  />
);
