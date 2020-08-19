import React from 'react';
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
        firstName: 'Daniel',
        lastName: 'Ramirez',
        role: 'Principal Investigator',
      },
      {
        id: '2',
        displayName: 'Peter Venkman',
        firstName: 'Peter',
        lastName: 'Venkman',
        role: 'Project Manager',
      },
      {
        id: '3',
        displayName: 'Tess W. B. Goetz',
        firstName: 'Tess',
        lastName: 'Goetz',
        role: 'Collaborator',
      },
      {
        id: '4',
        displayName: 'Robin Peploe',
        firstName: 'Robin',
        lastName: 'Peploe',
        role: 'Collaborator',
      },
      {
        id: '5',
        displayName: 'Alice Lane',
        firstName: 'Alice',
        lastName: 'Lane',
        role: 'Collaborator',
      },
      {
        id: '6',
        displayName: 'Philip Mars',
        firstName: 'Philip',
        lastName: 'Mars',
        role: 'Collaborator',
      },
      {
        id: '7',
        displayName: 'Emmanuel Depay',
        firstName: 'Emanuel',
        lastName: 'Depay',
        role: 'Collaborator',
      },
    ]}
  />
);
