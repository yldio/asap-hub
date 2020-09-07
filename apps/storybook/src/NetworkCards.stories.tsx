import React from 'react';
import { number, text } from '@storybook/addon-knobs';

import { TeamCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Team / Team Card',
};
const member = {
  id: 'ff0e04ac-4769-44ed-8d3b-245c1bfe17b3',
  firstName: 'Mason',
  lastName: 'Carpenter',
  displayName: 'Birdie Romeo',
  role: 'VrrPdl',
};
const skill = 'Neurological Diseases';

const teamCardProps = () => {
  const numberOfSkills = number('Number of skills', 3, { min: 0 });
  const numberOfMembers = number('Number of team members', 3, { min: 0 });
  return {
    id: 'ee98d044-79a7-4028-915d-7f88793e3190',
    displayName: text('Display Name', 'Team Barnes, A.'),
    applicationNumber: 'P9gr6',
    projectTitle:
      'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',

    projectSummary: text(
      'Project Summary',
      'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
    ),
    skills: [...Array(numberOfSkills).fill(skill, 0, numberOfSkills)],
    members: [...Array(numberOfMembers).fill(member, 0, numberOfMembers)],
    lastModifiedDate: '2020-07-31T11:45:14Z',
  };
};

export const Normal = () => <TeamCard {...teamCardProps()} />;
