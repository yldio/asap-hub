import { render, fireEvent, screen } from '@testing-library/react';
import { UserTeam } from '@asap-hub/model';

import UserTeamsTabbedCard from '../UserTeamsTabbedCard';

const props = {
  userName: 'Foo B',
  teams: [],
  isUserAlumni: false,
};

it('displays the title', () => {
  render(<UserTeamsTabbedCard {...props} userName="Brad B" />);

  expect(screen.getByText("Brad B's Teams")).toBeInTheDocument();
});

it('renders the no teams message', () => {
  const { rerender } = render(
    <UserTeamsTabbedCard {...props} isUserAlumni={true} />,
  );
  expect(screen.getByText('There are no previous teams.')).toBeVisible();
  rerender(<UserTeamsTabbedCard {...props} isUserAlumni={false} />);
  expect(screen.getByText('There are no current teams.')).toBeVisible();
});

it('displays the show more message', () => {
  const teams: UserTeam[] = Array.from(Array(7).keys()).map((index) => ({
    id: `team-${index}`,
    displayName: 'Active Team',
    role: 'Lead PI (Core Leadership)',
  }));

  render(<UserTeamsTabbedCard {...props} teams={teams} />);

  const showMore = screen.getByText('View More Teams');
  expect(showMore).toBeInTheDocument();
  fireEvent.click(showMore);

  const showLess = screen.getByText('View Less Teams');
  expect(showLess).toBeInTheDocument();
});

it('splits the current and inactive teams', () => {
  const teams: UserTeam[] = [
    {
      id: 'team-1',
      displayName: 'Team1',
      role: 'Lead PI (Core Leadership)',
    },
    {
      id: 'team-2',
      displayName: 'Team2',
      role: 'Lead PI (Core Leadership)',
      teamInactiveSince: '2020-09-25T09:42:51.000Z',
    },
    {
      id: 'team-3',
      displayName: 'Team3',
      role: 'Lead PI (Core Leadership)',
      inactiveSinceDate: '2020-09-24T09:42:51.000Z',
    },
  ];
  render(<UserTeamsTabbedCard {...props} teams={teams} />);

  expect(screen.getByText(/team1/i)).toBeVisible();
  expect(screen.queryByText(/team2/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/team3/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Previous Teams (2)'));

  expect(screen.getByText(/team2/i)).toBeVisible();
  expect(screen.getByText('Fri, 25 Sep 2020')).toBeVisible();
  expect(screen.getByText(/team3/i)).toBeVisible();
  expect(screen.getByText('Thu, 24 Sep 2020')).toBeVisible();
  expect(screen.queryByText(/team1/i)).not.toBeInTheDocument();
});
