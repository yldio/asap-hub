import { ComponentProps } from 'react';
import {
  createInterestGroupResponse,
  createListInterestGroupResponse,
  createListTeamResponse,
  createTeamListItemResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamTabbedInterestGroupsCard from '../TeamInterestGroupsTabbedCard';

const props: ComponentProps<typeof TeamTabbedInterestGroupsCard> = {
  teamId: '1',
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
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const groups = [
    {
      ...createInterestGroupResponse(),
      name: 'Group Active',
      description: 'Group Active description',
    },
    {
      ...createInterestGroupResponse(),
      name: 'Group Inactive',
      description: 'Group Inactive description',
      active: false,
    },
    {
      ...createInterestGroupResponse(),
      name: 'Group Team Membership Ended in the Past',
      description: 'Group Team Membership Ended in the Past description',
      teams: [
        {
          ...createTeamListItemResponse(),
          endDate: new Date(Date.now() - ONE_DAY_IN_MS).toISOString(),
        },
      ],
    },
    {
      ...createInterestGroupResponse(),
      name: 'Group Team Membership Ended in the Future',
      description: 'Group Team Membership Ended in the Future description',
      teams: [
        {
          ...createTeamListItemResponse(),
          endDate: new Date(Date.now() + 3 * ONE_DAY_IN_MS).toISOString(),
        },
      ],
    },
  ];

  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      interestGroups={groups}
      title="Team Interest Groups"
      teamId="t0"
    />,
  );

  expect(screen.getByText('Group Active')).toBeVisible();
  expect(
    screen.getByText('Group Team Membership Ended in the Future'),
  ).toBeVisible();

  expect(screen.queryByText('Group Inactive')).not.toBeInTheDocument();
  expect(
    screen.queryByText('Group Team Membership Ended in the Past'),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Past Memberships (2)'));
  expect(screen.queryByText('Group Active')).not.toBeInTheDocument();
  expect(
    screen.queryByText('Group Team Membership Ended in the Future'),
  ).not.toBeInTheDocument();

  expect(screen.getByText('Group Inactive')).toBeVisible();
  expect(
    screen.getByText('Group Team Membership Ended in the Past'),
  ).toBeVisible();
});

it('shows inactive badge when group is inactive', () => {
  const groups = [
    {
      ...createInterestGroupResponse(),
      name: 'Group with Inactive Team',
      description: 'Group description',
      active: false,
      teams: [createTeamListItemResponse()],
    },
  ];

  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      teamId="t0"
      interestGroups={groups}
      title="Team Interest Groups"
    />,
  );
  fireEvent.click(screen.getByText('Past Memberships (1)'));

  expect(screen.getByText('Inactive')).toBeVisible();
});

it('shows inactive badge when team membership has endDate in the past', () => {
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const groups = [
    {
      ...createInterestGroupResponse(),
      name: 'Group with Ended Team Membership',
      description: 'Group description',
      active: true,
      teams: [
        {
          ...createTeamListItemResponse(),
          endDate: new Date(Date.now() - ONE_DAY_IN_MS).toISOString(),
        },
      ],
    },
  ];

  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      teamId="t0"
      interestGroups={groups}
      title="Team Interest Groups"
    />,
  );
  fireEvent.click(screen.getByText('Past Memberships (1)'));
  expect(screen.getByText('Inactive')).toBeVisible();
});

it('does not show inactive badge when team membership has endDate in the future', () => {
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const groups = [
    {
      ...createInterestGroupResponse(),
      name: 'Group with Active Team Membership',
      description: 'Group description',
      active: true,
      teams: [
        {
          ...createTeamListItemResponse(),
          endDate: new Date(Date.now() + ONE_DAY_IN_MS).toISOString(),
        },
      ],
    },
  ];

  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      teamId="t0"
      interestGroups={groups}
      title="Team Interest Groups"
    />,
  );

  expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
});

it('does not show inactive badge when group is active and team membership has no endDate', () => {
  const groups = [
    {
      ...createInterestGroupResponse(),
      name: 'Group with Active Team Membership',
      description: 'Group description',
      active: true,
      teams: [createTeamListItemResponse()],
    },
  ];

  render(
    <TeamTabbedInterestGroupsCard
      {...props}
      teamId="t0"
      interestGroups={groups}
      title="Team Interest Groups"
    />,
  );

  expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
});
