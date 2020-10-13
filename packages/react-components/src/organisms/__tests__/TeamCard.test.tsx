import React from 'react';
import { render } from '@testing-library/react';

import TeamCard from '../TeamCard';

const member = {
  id: 'ff0e04ac-4769-44ed-8d3b-245c1bfe17b3',
  firstName: 'Mason',
  lastName: 'Carpenter',
  email: 'masoncarpenter@foo.com',
  displayName: 'Birdie Romeo',
  role: 'Lead PI' as const,
};
const teamCardProps = {
  id: 'ee98d044-79a7-4028-915d-7f88793e3190',
  displayName: 'A Barnes',
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
  href: 'http://localhost/teams/ee98d044-79a7-4028-915d-7f88793e3190',
};

it('renders the title', () => {
  const { getByRole } = render(<TeamCard {...teamCardProps} />);
  expect(getByRole('heading').textContent).toEqual('Team A Barnes');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('uses singular for one team member', () => {
  const { getByText } = render(
    <TeamCard {...teamCardProps} members={[member]} />,
  );
  expect(getByText('1 Team Member')).toBeVisible();
});

it('pluralises when more than one team member', () => {
  const { getByText } = render(
    <TeamCard {...teamCardProps} members={Array(3).fill(member)} />,
  );
  expect(getByText('3 Team Members')).toBeVisible();
});
