import React from 'react';
import { NetworkListPage, TeamCard } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Network',
  decorators: [LayoutDecorator],
};

const member = {
  id: 'ff0e04ac-4769-44ed-8d3b-245c1bfe17b3',
  firstName: 'Mason',
  lastName: 'Carpenter',
  displayName: 'Birdie Romeo',
  role: 'VrrPdl',
};

const commonProps = () => ({
  teams: [
    {
      id: 'ee98d044-79a7-4028-915d-7f88793e3190',
      displayName: 'Team Barnes, A.',
      applicationNumber: 'P9gr6',
      projectTitle:
        'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
      projectSummary:
        'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
      skills: [
        'Neurological Diseases',
        'Neurological Diseases',
        'Neurological Diseases',
        'Neurological Diseases',
        'Neurological Diseases',
        'Neurological Diseases',
      ],
      members: [member, member],
      lastModifiedDate: '2020-09-03T10:59:26Z',
    },
    {
      id: 'ee98d044-79a7-4028-915d-7f88793e3190',
      displayName: 'Team Barnes, B.',
      applicationNumber: 'P9gr6',
      projectTitle:
        'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
      projectSummary:
        'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
      skills: ['Neurological Diseases'],
      members: [member],
      lastModifiedDate: '2020-09-03T10:59:26Z',
    },
  ],
});
export const TeamList = () => (
  <NetworkListPage>
    {commonProps().teams.map((team) => {
      const { id } = team;
      return (
        <div key={id}>
          <TeamCard {...team} />
        </div>
      );
    })}
  </NetworkListPage>
);
