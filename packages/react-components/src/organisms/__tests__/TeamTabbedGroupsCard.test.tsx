import { ComponentProps } from 'react';
import {
  createGroupResponse,
  createListGroupResponse,
  createListTeamResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamTabbedGroupsCard from '../TeamTabbedGroupsCard';

const props: ComponentProps<typeof TeamTabbedGroupsCard> = {
  groups: [],
  title: '',
};
it('renders the team groups tabbed card', () => {
  const groups = [
    {
      ...createGroupResponse(),
      name: 'Group 1',
      description: 'Group 1 description',
    },
  ];
  const { rerender } = render(
    <TeamTabbedGroupsCard
      {...props}
      groups={groups}
      title="Team Interest Groups"
      inactive="2020-01-02"
    />,
  );
  expect(screen.getByText('Team Interest Groups')).toBeVisible();

  expect(screen.getByText('Group 1')).toBeVisible();
  expect(screen.getByText('Group 1 description')).toBeVisible();
  rerender(
    <TeamTabbedGroupsCard
      {...props}
      groups={groups}
      title="Team Interest Groups"
    />,
  );
  expect(screen.getByText('Active Memberships (1)')).toBeVisible();
  expect(screen.getByText('Past Memberships (0)')).toBeVisible();
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
  rerender(
    <TeamTabbedGroupsCard {...props} inactive={new Date().toISOString()} />,
  );
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
