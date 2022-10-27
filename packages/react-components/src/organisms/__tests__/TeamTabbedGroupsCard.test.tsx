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
  render(
    <TeamTabbedGroupsCard
      {...props}
      groups={[
        {
          ...createGroupResponse(),
          name: 'Group 1',
          description: 'Group 1 description',
        },
      ]}
      title="Team Interest Groups"
    />,
  );
  expect(screen.getByText('Team Interest Groups')).toBeVisible();
  expect(screen.getByText('Active Memberships (0)')).toBeVisible();
  expect(screen.getByText('Past Memberships (1)')).toBeVisible();
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

it('renders the no past members message', () => {
  render(<TeamTabbedGroupsCard {...props} />);

  expect(screen.getByText('There are no active memberships.')).toBeVisible();
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
