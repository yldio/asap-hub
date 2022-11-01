import { ComponentProps } from 'react';
import { TeamMember } from '@asap-hub/model';
import { createTeamResponseMembers, teamMember } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamMembersTabbedCard from '../TeamMembersTabbedCard';

const props: ComponentProps<typeof TeamMembersTabbedCard> = {
  members: [],
  title: '',
};
it('renders the members tabbed card', () => {
  const labName = 'Olsen';
  const members: TeamMember[] = [
    {
      ...teamMember,
      id: 'member-1',
      displayName: 'Beyonce Knowles',
      role: 'ASAP Staff',
      alumniSinceDate: '2020-01-02',
    },
    {
      ...teamMember,
      id: 'member-2',
      displayName: 'Justin Bieber',
      role: 'Collaborating PI',
      labs: [
        {
          id: 'lab-1',
          name: labName,
        },
      ],
    },
  ];

  render(
    <TeamMembersTabbedCard {...props} members={members} title="Example" />,
  );
  expect(screen.getByRole('heading').textContent).toEqual('Example');

  members.forEach((member) => {
    expect(screen.getByText(member.displayName)).toBeInTheDocument();
    expect(screen.getByText(member.role)).toBeInTheDocument();
  });

  expect(screen.getAllByTitle(/Alumni Badge/i)).toHaveLength(1);
  expect(screen.getByText(`${labName} Lab`)).toBeInTheDocument();
});

it('renders the no members message', () => {
  const { rerender } = render(
    <TeamMembersTabbedCard
      {...props}
      title="Team Members"
      inactive={new Date().toISOString()}
    />,
  );

  expect(screen.getByText('There are no past team members.')).toBeVisible();
  rerender(<TeamMembersTabbedCard {...props} title="Team Members" />);
  expect(screen.getByText('There are no active team members.')).toBeVisible();
});

it('shows the correct more and less button text', () => {
  render(
    <TeamMembersTabbedCard
      {...props}
      members={createTeamResponseMembers({ teamMembers: 28 })}
      title="Example"
    />,
  );
  fireEvent.click(screen.getByText('View More Members'));
  expect(screen.getByText(/View Less Members/)).toBeVisible();
});
