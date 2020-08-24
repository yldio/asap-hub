import React from 'react';
import { formatISO, subDays } from 'date-fns';
import { TeamPage, TeamAbout } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Team',
  decorators: [LayoutDecorator],
};

const commonProps = () => ({
  id: '42',
  displayName: 'Ramirez, T',
  projectTitle:
    'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent steam cell brain organoids.',
  applicationNumber: 'Unknnow',
  lastModifiedDate: formatISO(subDays(new Date(), 2)),
  skills: [],
  members: [
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
  ],
  aboutHref: '/wrong',
  outputsHref: '/wrong',
});

export const AboutTab = () => (
  <TeamPage {...commonProps()} aboutHref="#">
    <TeamAbout {...commonProps()}></TeamAbout>
  </TeamPage>
);

export const OutputsTab = () => <TeamPage {...commonProps()}>Outputs</TeamPage>;
