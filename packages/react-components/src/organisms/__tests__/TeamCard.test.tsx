import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import * as flags from '@asap-hub/flags';
import TeamCard from '../TeamCard';

const teamCardProps: ComponentProps<typeof TeamCard> = {
  id: 'ee98d044-79a7-4028-915d-7f88793e3190',
  displayName: 'A Barnes',
  projectTitle:
    'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
  teamType: 'Discovery Team',
  tags: [
    { id: '1', name: 'Neurological Diseases' },
    { id: '1', name: 'Clinical Neurology' },
    { id: '1', name: 'Adult Neurology' },
    { id: '1', name: 'Neuroimaging' },
    { id: '1', name: 'A53T' },
    { id: '1', name: 'alpha-synuclein interactions' },
    { id: '1', name: 'alpha-synuclein' },
    { id: '1', name: 'autophagy' },
  ],
  memberCount: 1,
  labCount: 0,
  researchTheme: 'GP2',
  resourceType: 'Analysis',
  linkedProjectId: 'prod-123',
  projectType: 'Discovery Project',
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
  expect(getByTitle('Inactive Team')).toBeInTheDocument();
  rerender(<TeamCard {...teamCardProps} inactiveSince={undefined} />);
  expect(queryByText('Inactive')).not.toBeInTheDocument();
});

it('uses singular for one team member', () => {
  const { getByText } = render(<TeamCard {...teamCardProps} />);
  expect(getByText('1 Team Member')).toBeVisible();
});

it('displays footer', () => {
  const { getByText } = render(<TeamCard {...teamCardProps} />);
  expect(getByText(/Team Member/i)).toBeVisible();
});

it('renders the team type pill', () => {
  const { getByText } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Discovery Team"
      projectType="Discovery Project"
    />,
  );
  expect(getByText('Discovery Team')).toBeVisible();
});

it('renders the research theme pill for Discovery Team', () => {
  const { getByText } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Discovery Team"
      projectType="Discovery Project"
      researchTheme="Test Theme"
    />,
  );
  expect(getByText('Test Theme')).toBeVisible();
});

it('does not render the research theme pill for Resource Team', () => {
  const { queryByText } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Resource Team"
      projectType="Resource Project"
      researchTheme="Test Theme"
    />,
  );
  expect(queryByText('Test Theme')).not.toBeInTheDocument();
});

it('renders the resource type pill for Resource Team', () => {
  const { getByText } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Resource Team"
      projectType="Resource Project"
      resourceType="Test Resource"
    />,
  );
  expect(getByText('Test Resource')).toBeVisible();
});

it('renders project title and links to discovery project when PROJECTS_MVP flag is enabled', () => {
  jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  const { getByText } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Discovery Team"
      projectType="Discovery Project"
      linkedProjectId="123"
    />,
  );
  const projectTitle = getByText(teamCardProps.projectTitle!);
  const anchor = projectTitle.closest('a');
  expect(anchor).toHaveAttribute(
    'href',
    expect.stringMatching(/discovery\/123/),
  );
});

it('renders project title and links to resource project when PROJECTS_MVP flag is enabled', () => {
  jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  const { getByText } = render(
    <TeamCard
      {...teamCardProps}
      projectType="Resource Project"
      linkedProjectId="456"
    />,
  );
  const projectTitle = getByText(teamCardProps.projectTitle!);
  const anchor = projectTitle.closest('a');
  expect(anchor).toHaveAttribute(
    'href',
    expect.stringMatching(/resource\/456/),
  );
});

it('does not render project title when PROJECTS_MVP flag is disabled', () => {
  jest.spyOn(flags, 'isEnabled').mockReturnValue(false);
  const { queryByText } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Discovery Team"
      projectType="Discovery Project"
      linkedProjectId="123"
    />,
  );
  expect(queryByText(teamCardProps.projectTitle!)).not.toBeInTheDocument();
});

it('renders project title without link when linkedProjectId is not provided', () => {
  jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  const { getByText } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Discovery Team"
      projectType="Discovery Project"
      linkedProjectId={undefined}
    />,
  );
  const projectTitle = getByText(teamCardProps.projectTitle!);
  const anchor = projectTitle.closest('a');
  expect(anchor).not.toBeInTheDocument();
});

it('renders the Discovery Project icon for Discovery Team when PROJECTS_MVP flag is enabled', () => {
  jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  const { getByTitle } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Discovery Team"
      projectType="Discovery Project"
      linkedProjectId="123"
    />,
  );
  expect(getByTitle('Discovery Project')).toBeInTheDocument();
});

it('renders the Resource Project icon for Resource Team when PROJECTS_MVP flag is enabled', () => {
  jest.spyOn(flags, 'isEnabled').mockReturnValue(true);
  const { getByTitle } = render(
    <TeamCard
      {...teamCardProps}
      teamType="Resource Team"
      projectType="Resource Project"
      linkedProjectId="123"
    />,
  );
  expect(getByTitle('Resource Project')).toBeInTheDocument();
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

it('does not display footer when the team is inactive', () => {
  const { queryByText } = render(
    <TeamCard {...teamCardProps} inactiveSince="2022-09-30T09:00:00Z" />,
  );
  expect(queryByText(/Team Member/i)).not.toBeInTheDocument();
  expect(queryByText(/Lab/i)).not.toBeInTheDocument();
});
