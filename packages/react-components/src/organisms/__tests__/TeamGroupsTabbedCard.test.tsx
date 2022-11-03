import { ComponentProps } from 'react';
import {
  createGroupResponse,
  createListGroupResponse,
  createListTeamResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamTabbedGroupsCard from '../TeamGroupsTabbedCard';

const props: ComponentProps<typeof TeamTabbedGroupsCard> = {
  groups: [],
  title: '',
  isTeamInactive: false,
};
it('renders the team groups tabbed card', () => {
  const groups = [
    {
      ...createGroupResponse(),
      name: 'Group 1',
      description: 'Group 1 description',
    },
  ];
  render(
    <TeamTabbedGroupsCard
      {...props}
      groups={groups}
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
    <TeamTabbedGroupsCard
      {...props}
      groups={[
        {
          ...createGroupResponse(),
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
    <TeamTabbedGroupsCard
      {...props}
      groups={[
        {
          ...createGroupResponse(),
          teams: createListTeamResponse(2).items,
        },
      ]}
      title="Team Interest Groups"
    />,
  );

  expect(screen.getByText('2 Teams')).toBeInTheDocument();
});

it('renders the no members message', () => {
  const { rerender } = render(<TeamTabbedGroupsCard {...props} />);

  expect(screen.getByText('There are no active memberships.')).toBeVisible();
  rerender(<TeamTabbedGroupsCard {...props} isTeamInactive={true} />);
  expect(screen.getByText('There are no past memberships.')).toBeVisible();
});

it('shows the correct more and less button text', () => {
  render(
    <TeamTabbedGroupsCard
      {...props}
      groups={[...createListGroupResponse(20).items]}
      title="Team Members"
    />,
  );

  fireEvent.click(screen.getByText('View More Groups'));
  expect(screen.getByText(/View Less Groups/)).toBeVisible();
});

it('shows the correct tab numbers based on group active state', () => {
  const groups = [
    {
      ...createGroupResponse(),
      name: 'Group 1',
      description: 'Group 1 description',
    },
    {
      ...createGroupResponse(),
      name: 'Group 2',
      description: 'Group 1 description',
      active: false,
    },
  ];
  const { rerender } = render(
    <TeamTabbedGroupsCard
      {...props}
      groups={groups}
      title="Team Interest Groups"
    />,
  );

  expect(screen.getByText('Active Memberships (1)')).toBeVisible();
  expect(screen.getByText('Past Memberships (1)')).toBeVisible();

  rerender(
    <TeamTabbedGroupsCard {...props} groups={groups} isTeamInactive={true} />,
  );
  expect(screen.getByText('Active Memberships (0)')).toBeVisible();
  expect(screen.getByText('Past Memberships (2)')).toBeVisible();
});

it('splits the groups based on active status', () => {
  const groups = [
    {
      ...createGroupResponse(),
      name: 'Group 1',
      description: 'Group 1 description',
    },
    {
      ...createGroupResponse(),
      name: 'Group 2',
      description: 'Group 1 description',
      active: false,
    },
  ];

  render(
    <TeamTabbedGroupsCard
      {...props}
      groups={groups}
      title="Team Interest Groups"
    />,
  );

  expect(screen.getByText('Group 1')).toBeVisible();
  expect(screen.queryByText('Group 2')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Past Memberships (1)'));
  expect(screen.queryByText('Group 1')).not.toBeInTheDocument();
  expect(screen.getByText('Group 2')).toBeVisible();
});
