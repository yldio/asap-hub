import React from 'react';
import { TeamMembersSection } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Team Profile / Members',
};

export const Normal = () => (
  <TeamMembersSection
    title={'Team Members (7)'}
    members={[
      {
        id: '1',
        href: '#1',
        displayName: 'Daniel Ramirez',
        firstName: 'Daniel',
        lastName: 'Ramirez',
        role: 'Lead PI (Core Leadership)',
      },
      {
        id: '2',
        href: '#2',
        displayName: 'Peter Venkman',
        firstName: 'Peter',
        lastName: 'Venkman',
        role: 'Project Manager',
        avatarUrl: text(
          'Member 2 Avatar URL',
          'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
        ),
      },
      {
        id: '3',
        href: '#3',
        displayName: 'Tess W. B. Goetz',
        firstName: 'Tess',
        lastName: 'Goetz',
        role: 'Collaborating PI',
      },
      {
        id: '4',
        href: '#4',
        displayName: 'Robin Peploe',
        firstName: 'Robin',
        lastName: 'Peploe',
        role: 'Collaborating PI',
      },
      {
        id: '5',
        href: '#5',
        displayName: 'Alice Lane',
        firstName: 'Alice',
        lastName: 'Lane',
        role: 'Collaborating PI',
      },
      {
        id: '6',
        href: '#6',
        displayName: 'Philip Mars',
        firstName: 'Philip',
        lastName: 'Mars',
        role: 'Collaborating PI',
      },
      {
        id: '7',
        href: '#7',
        displayName: 'Emmanuel Depay',
        firstName: 'Emanuel',
        lastName: 'Depay',
        role: 'Collaborating PI',
      },
    ]}
  />
);

export const Empty = () => <TeamMembersSection members={[]} />;
