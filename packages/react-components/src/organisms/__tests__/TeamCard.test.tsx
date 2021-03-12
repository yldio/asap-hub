import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import TeamCard from '../TeamCard';

const member = {
  id: 'ff0e04ac-4769-44ed-8d3b-245c1bfe17b3',
  firstName: 'Mason',
  lastName: 'Carpenter',
  email: 'masoncarpenter@foo.com',
  displayName: 'Birdie Romeo',
  role: 'Lead PI (Core Leadership)' as const,
};
const teamCardProps: ComponentProps<typeof TeamCard> = {
  id: 'ee98d044-79a7-4028-915d-7f88793e3190',
  displayName: 'A Barnes',
  projectTitle:
    'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
  skills: [
    'Neurological Diseases',
    'Clinical Neurology',
    'Adult Neurology',
    'Neuroimaging',
    'A53T',
    'alpha-synuclein interactions',
    'alpha-synuclein',
    'autophagy',
  ],
  members: [member],
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
