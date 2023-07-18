import { ComponentProps } from 'react';
import {
  createInterestGroupResponse,
  createListInterestGroupResponse,
  createListTeamResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamTabbedInterestGroupsCard from '../TeamInterestGroupsTabbedCard';

const props: ComponentProps<typeof TeamTabbedInterestGroupsCard> = {
  interestGroups: [],
  title: '',
  isTeamInactive: false,
};
it('renders the team groups tabbed card', () => {
  const groups = [
    {
      ...createInterestGroupResponse(),
      name: 'Group 1',
      description: 'Group 1 description',
    },
  ];
  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      interestGroups={groups}
      title="Team Interest Groups"
    />,
  );

  expect(screen.getByText('Team Interest Groups')).toBeVisible();
  expect(screen.getByText('Active Memberships (1)')).toBeVisible();
  expect(screen.getByText('Group 1')).toBeVisible();
  expect(screen.getByText('Group 1 description')).toBeVisible();
});

it('renders a group with 1 team in a singular form', () => {
  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      interestGroups={[
        {
          ...createInterestGroupResponse(),
          teams: [createTeamResponse()],
        },
      ]}
      title="Team Interest Groups"
    />,
  );

  expect(screen.getByText('1 Team')).toBeInTheDocument();
});

it('renders a group with multiple teams in a plurar form', () => {
  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      interestGroups={[
        {
          ...createInterestGroupResponse(),
          teams: createListTeamResponse(2).items,
        },
      ]}
      title="Team Interest Groups"
    />,
  );

  expect(screen.getByText('2 Teams')).toBeInTheDocument();
});

it('renders the no members message', () => {
  const { rerender } = render(<TeamTabbedInterestGroupsCard {...props} />);

  expect(screen.getByText('There are no active memberships.')).toBeVisible();
  rerender(<TeamTabbedInterestGroupsCard {...props} isTeamInactive={true} />);
  expect(screen.getByText('There are no past memberships.')).toBeVisible();
});

it('shows the correct more and less button text', () => {
  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      interestGroups={[...createListInterestGroupResponse(20).items]}
      title="Team Members"
    />,
  );

  fireEvent.click(screen.getByText('View More Groups'));
  expect(screen.getByText(/View Less Groups/)).toBeVisible();
});

it('shows the correct tab numbers based on group active state', () => {
  const groups = [
    {
      ...createInterestGroupResponse(),
      name: 'Group 1',
      description: 'Group 1 description',
    },
    {
      ...createInterestGroupResponse(),
      name: 'Group 2',
      description: 'Group 1 description',
      active: false,
    },
  ];
  const { rerender } = render(
    <TeamTabbedInterestGroupsCard
      {...props}
      interestGroups={groups}
      title="Team Interest Groups"
    />,
  );

  expect(screen.getByText('Active Memberships (1)')).toBeVisible();
  expect(screen.getByText('Past Memberships (1)')).toBeVisible();

  rerender(
    <TeamTabbedInterestGroupsCard
      {...props}
      interestGroups={groups}
      isTeamInactive={true}
    />,
  );
  expect(screen.getByText('Active Memberships (0)')).toBeVisible();
  expect(screen.getByText('Past Memberships (2)')).toBeVisible();
});

it('splits the groups based on active status', () => {
  const groups = [
    {
      ...createInterestGroupResponse(),
      name: 'Group 1',
      description: 'Group 1 description',
    },
    {
      ...createInterestGroupResponse(),
      name: 'Group 2',
      description: 'Group 1 description',
      active: false,
    },
  ];

  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      interestGroups={groups}
      title="Team Interest Groups"
    />,
  );

  expect(screen.getByText('Group 1')).toBeVisible();
  expect(screen.queryByText('Group 2')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Past Memberships (1)'));
  expect(screen.queryByText('Group 1')).not.toBeInTheDocument();
  expect(screen.getByText('Group 2')).toBeVisible();
});
