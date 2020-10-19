import React from 'react';
import { MembersSection } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Team / Members',
};

export const Empty = () => (
  <MembersSection title={'Team Members (0)'} members={[]} />
);

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
        role: 'Lead PI',
      },
      {
        id: '2',
        displayName: 'Peter Venkman',
        firstName: 'Peter',
        lastName: 'Venkman',
        email: 'peter@venk.com',
        role: 'Project Manager',
      },
      {
        id: '3',
        displayName: 'Tess W. B. Goetz',
        firstName: 'Tess',
        lastName: 'Goetz',
        email: 'tess@go.com',
        role: 'Collaborator',
      },
      {
        id: '4',
        displayName: 'Robin Peploe',
        firstName: 'Robin',
        lastName: 'Peploe',
        email: 'robin@pep.com',
        role: 'Collaborator',
      },
      {
        id: '5',
        displayName: 'Alice Lane',
        firstName: 'Alice',
        lastName: 'Lane',
        email: 'alice@lane.com',
        role: 'Collaborator',
      },
      {
        id: '6',
        displayName: 'Philip Mars',
        firstName: 'Philip',
        lastName: 'Mars',
        email: 'philip@mars.com',
        role: 'Collaborator',
      },
      {
        id: '7',
        displayName: 'Emmanuel Depay',
        firstName: 'Emanuel',
        lastName: 'Depay',
        email: 'em@nuel.com',
        role: 'Collaborator',
      },
    ]}
  />
);
