import React from 'react';
import { TeamCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Network Cards',
};
const member = {
  id: 'ff0e04ac-4769-44ed-8d3b-245c1bfe17b3',
  firstName: 'Mason',
  lastName: 'Carpenter',
  displayName: 'Birdie Romeo',
  role: 'VrrPdl',
};
const teamCardProps = {
  id: 'ee98d044-79a7-4028-915d-7f88793e3190',
  displayName: '!AX54pQ$Jgih7svEaA',
  applicationNumber: 'P9gr6',
  projectTitle:
    'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
  projectSummary:
    'Guj ge te reh hiditzec suw uki cu ziiku tisabe wiwuvev sor jec to gip onrof. Tul edzec zomivbu gotum lakgilzo hip hemgit agzo ew egirub hecguci kistozat hitfankij fiiw muhanti motec eb. Zepo av zimilo jekeker ekrud oti lanidwe peceru faprivsi led sicew sogure ni. Vanbo so fizam wibup hipuh fumuz me agapazcov ucotohfo liwwu ge ki wekezot.',
  skills: [
    'Neurological Diseases',
    'Clinical Neurology',
    'Adult Neurology',
    'Neuroimaging',
    'Neurologic Examination',
    'Neuroprotection',
  ],
  members: [member],
  lastModifiedDate: '2020-07-31T11:45:14Z',
};

export const TeamCardNormal = () => <TeamCard {...teamCardProps} />;

const teamCardFiveSkillsProps = {
  ...teamCardProps,
  skills: teamCardProps.skills.slice(0, 5),
};

export const TeamCardFiveSkills = () => (
  <TeamCard {...teamCardFiveSkillsProps} />
);

const TeamCardNoSkillsProps = { ...teamCardProps, skills: [] };

export const TeamCardNoSkills = () => <TeamCard {...TeamCardNoSkillsProps} />;

const teamCardMembersProps = {
  ...teamCardProps,
  members: [...Array(3).fill(member, 0, 3)],
};

export const TeamCardMembers = () => <TeamCard {...teamCardMembersProps} />;
