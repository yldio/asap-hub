import React from 'react';
import { MembersSection } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Members',
};

export const Empty = () => <MembersSection members={[]} />;

export const Normal = () => (
  <MembersSection
    title={'Team Members (7)'}
    members={[
      {
        id: '1',
        displayName: 'Daniel Ramirez',
        firstName: 'Daniel',
        lastName: 'Ramirez',
        email: 'd@niel.com',
        role: 'Lead PI (Core Leadership)',
      },
      {
        id: '2',
        displayName: 'Peter Venkman',
        firstName: 'Peter',
        lastName: 'Venkman',
        email: 'peter@venk.com',
        role: 'Project Manager',
        avatarUrl: text(
          'Member 2 Avatar URL',
          'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
        ),
      },
      {
        id: '3',
        displayName: 'Tess W. B. Goetz',
        firstName: 'Tess',
        lastName: 'Goetz',
        email: 'tess@go.com',
        role: 'Collaborating PI',
      },
      {
        id: '4',
        displayName: 'Robin Peploe',
        firstName: 'Robin',
        lastName: 'Peploe',
        email: 'robin@pep.com',
        role: 'Collaborating PI',
      },
      {
        id: '5',
        displayName: 'Alice Lane',
        firstName: 'Alice',
        lastName: 'Lane',
        email: 'alice@lane.com',
        role: 'Collaborating PI',
      },
      {
        id: '6',
        displayName: 'Philip Mars',
        firstName: 'Philip',
        lastName: 'Mars',
        email: 'philip@mars.com',
        role: 'Collaborating PI',
      },
      {
        id: '7',
        displayName: 'Emmanuel Depay',
        firstName: 'Emanuel',
        lastName: 'Depay',
        email: 'em@nuel.com',
        role: 'Collaborating PI',
      },
    ]}
  />
);
