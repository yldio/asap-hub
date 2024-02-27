import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import TeamCard from '../TeamCard';

const teamCardProps: ComponentProps<typeof TeamCard> = {
  id: 'ee98d044-79a7-4028-915d-7f88793e3190',
  displayName: 'A Barnes',
  projectTitle:
    'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
  tags: [
    {id: '1', name: 'Neurological Diseases'},
    {id: '1', name: 'Clinical Neurology'},
    {id: '1', name: 'Adult Neurology'},
    {id: '1', name: 'Neuroimaging'},
    {id: '1', name: 'A53T'},
    {id: '1', name: 'alpha-synuclein interactions'},
    {id: '1', name: 'alpha-synuclein'},
    {id: '1', name: 'autophagy'},
  ],
  memberCount: 1,
  labCount: 0,
};

it('renders the title', () => {
  const { getByRole } = render(<TeamCard {...teamCardProps} />);
  expect(getByRole('heading').textContent).toEqual('Team A Barnes');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('renders the state tag for a inactive group', () => {
  const { getByText, rerender, queryByText, getByTitle } = render(
    <TeamCard {...teamCardProps} inactiveSince="2022-09-30T09:00:00Z" />,
  );
  expect(getByText('Inactive', { selector: 'span' })).toBeVisible();
  expect(getByTitle('Inactive')).toBeInTheDocument();
  rerender(<TeamCard {...teamCardProps} inactiveSince={undefined} />);
  expect(queryByText('Inactive')).not.toBeInTheDocument();
});

it('uses singular for one team member', () => {
  const { getByText } = render(<TeamCard {...teamCardProps} />);
  expect(getByText('1 Team Member')).toBeVisible();
});

it('pluralises when more than one team member', () => {
  const { getByText } = render(<TeamCard {...teamCardProps} memberCount={3} />);
  expect(getByText('3 Team Members')).toBeVisible();
});

it('renders a lab count for multiple labs', () => {
  const { getByText } = render(<TeamCard {...teamCardProps} labCount={13} />);
  expect(getByText('13 Labs')).toBeVisible();
});

it('renders a lab count for a single lab using singular form', () => {
  const { getByText } = render(<TeamCard {...teamCardProps} labCount={1} />);
  expect(getByText('1 Lab')).toBeVisible();
});

it('does not display labs when 0 labs are avaialble', () => {
  const { queryByText } = render(<TeamCard {...teamCardProps} labCount={0} />);
  expect(queryByText(/lab/i)).toBeNull();
});
