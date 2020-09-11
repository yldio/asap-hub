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
  teamProfileHref:
    'http://localhost/teams/ee98d044-79a7-4028-915d-7f88793e3190',
};

it('renders the title', () => {
  const { getByRole } = render(<TeamCard {...teamCardProps} />);
  expect(getByRole('heading').textContent).toEqual('!AX54pQ$Jgih7svEaA');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('shows all skills when there are few', () => {
  const { getAllByRole } = render(
    <TeamCard
      {...teamCardProps}
      skills={['Neurological Diseases', 'Clinical Neurology']}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Neurological Diseases', 'Clinical Neurology']);
});

it('shows only the first skills when there are many', () => {
  const { getAllByRole } = render(
    <TeamCard
      {...teamCardProps}
      skills={[
        'Neurological Diseases',
        'Clinical Neurology',
        'Adult Neurology',
        'Neuroimaging',
      ]}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Neurological Diseases', 'Clinical Neurology', 'Adult Neurology']);
});

it('hides skills when there are none', () => {
  const { queryAllByRole } = render(
    <TeamCard {...teamCardProps} skills={[]} />,
  );
  expect(queryAllByRole('list')).toEqual([]);
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
