import { ComponentProps } from 'react';
import { createTeamResponseMembers } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamMembersTabbedCard from '../TeamMembersTabbedCard';

const props: ComponentProps<typeof TeamMembersTabbedCard> = {
  teamMembers: [],
  title: '',
};
it('renders the team members tabbed card', () => {
  render(
    <TeamMembersTabbedCard
      {...props}
      teamMembers={[
        {
          id: '1',
          firstName: 'Octavian',
          lastName: 'Ratiu',
          email: 'example@mail.com',
          displayName: 'Octavian Ratiu',
          role: 'Lead PI (Core Leadership)',
          labs: [{ id: '1', name: 'Test Laboratory' }],
        },
      ]}
      title="Team Members"
    />,
  );
  expect(screen.getByRole('heading').textContent).toEqual('Team Members');
  expect(screen.getByText('Past Team Members (1)')).toBeVisible();
  expect(screen.getByText(/Octavian/)).toBeVisible();
  expect(screen.getByText('Lead PI (Core Leadership)')).toBeVisible();
  expect(screen.getByText(/Test Laboratory/)).toBeVisible();
});

it('renders the no past members message', () => {
  render(<TeamMembersTabbedCard {...props} title="Team Members" />);

  expect(screen.getByText('There are no past team members.')).toBeVisible();
});

it('shows the correct more and less button text', () => {
  render(
    <TeamMembersTabbedCard
      {...props}
      title="Team Members"
      teamMembers={createTeamResponseMembers({
        teamMembers: 20,
        hasLabs: true,
      })}
    />,
  );

  fireEvent.click(screen.getByText('View More Members'));
  expect(screen.getByText(/View Less Members/)).toBeVisible();
});
