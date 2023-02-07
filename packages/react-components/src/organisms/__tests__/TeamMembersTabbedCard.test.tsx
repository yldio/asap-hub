import { ComponentProps } from 'react';
import { TeamMember } from '@asap-hub/model';
import { createTeamResponseMembers, teamMember } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamMembersTabbedCard from '../TeamMembersTabbedCard';

const props: ComponentProps<typeof TeamMembersTabbedCard> = {
  members: [],
  title: '',
  isTeamInactive: false,
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
    <TeamMembersTabbedCard
      {...props}
      members={members}
      title="Example"
      isTeamInactive={true}
    />,
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
      isTeamInactive={true}
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

it('shows the correct number of members', () => {
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
          name: 'test lab',
        },
      ],
    },
  ];
  const { rerender } = render(
    <TeamMembersTabbedCard {...props} members={members} title="Example" />,
  );

  expect(screen.getByText('Active Team Members (1)')).toBeVisible();
  expect(screen.getByText('Past Team Members (1)')).toBeVisible();

  rerender(
    <TeamMembersTabbedCard
      {...props}
      members={members}
      title="Example"
      isTeamInactive={true}
    />,
  );

  expect(screen.getByText('Active Team Members (0)')).toBeVisible();
  expect(screen.getByText('Past Team Members (2)')).toBeVisible();
});

it('splits the active, alumni and inactive users', () => {
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
          name: 'test lab',
        },
      ],
    },
    {
      ...teamMember,
      id: 'member-3',
      displayName: 'John Doe',
      role: 'ASAP Staff',
      inactiveSinceDate: '2020-01-02',
    },
  ];
  render(
    <TeamMembersTabbedCard {...props} members={members} title="Example" />,
  );

  expect(screen.queryByText('Beyonce Knowles')).not.toBeInTheDocument();
  expect(screen.getByText('Justin Bieber')).toBeVisible();

  fireEvent.click(screen.getByText('Past Team Members (2)'));

  expect(screen.getByText('Beyonce Knowles')).toBeVisible();
  expect(screen.queryByText('Justin Bieber')).not.toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeVisible();
});
