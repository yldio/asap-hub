import React from 'react';
import { array, object } from '@storybook/addon-knobs';
import { MembersSection } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Team / Members',
};

export const Normal = () => (
  <MembersSection
    members={[
      {
        id: '1',
        displayName: 'Daniel Ramirez',
        role: 'Principal Investigator',
      },
      {
        id: '2',
        displayName: 'Peter Venkman',
        role: 'Project Manager',
      },
      {
        id: '3',
        displayName: 'Tess W. B. Goetz',
        role: 'Collaborator',
      },
      {
        id: '4',
        displayName: 'Robin Peploe',
        role: 'Collaborator',
      },
      {
        id: '5',
        displayName: 'Alice Lane',
        role: 'Collaborator',
      },
      {
        id: '6',
        displayName: 'Philip Mars',
        role: 'Collaborator',
      },
      {
        id: '7',
        displayName: 'Emmanuel Depay',
        role: 'Collaborator',
      },
    ]}
  />
);
