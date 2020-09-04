import React from 'react';
import { render } from '@testing-library/react';

import TeamCard from '../TeamCard';

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

it('renders the content', () => {
  const { getByText } = render(<TeamCard {...teamCardProps} />);
  expect(getByText('!AX54pQ$Jgih7svEaA')).toBeVisible();
  expect(getByText(teamCardProps.projectSummary)).toBeVisible();
  expect(getByText('1 Team Member')).toBeVisible();
  expect(getByText('Neurological Diseases')).toBeVisible();
});

it('Hides more than two team skills the content', () => {
  const { getAllByRole } = render(<TeamCard {...teamCardProps} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Neurological Diseases', 'Clinical Neurology', '+4']);
});

it('Shows just 2 skills when appropriate', () => {
  const props = { ...teamCardProps, skills: teamCardProps.skills.slice(0, 2) };
  const { getAllByRole } = render(<TeamCard {...props} />);
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Neurological Diseases', 'Clinical Neurology']);
});

it('Hides skills when there are none', () => {
  const props = { ...teamCardProps, skills: [] };
  const { queryAllByRole } = render(<TeamCard {...props} />);
  expect(queryAllByRole('listitem')).toEqual([]);
});

it('Pluralises when more than one team member', () => {
  const props = { ...teamCardProps, members: [...Array(3).fill(member, 0, 3)] };
  const { getByText } = render(<TeamCard {...props} />);
  expect(getByText('3 Team Members')).toBeVisible();
});
