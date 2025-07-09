import { ComponentProps } from 'react';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import GroupTeamsTabbedCard from '../InterestGroupTeamsTabbedCard';

const props: ComponentProps<typeof GroupTeamsTabbedCard> = {
  teams: [],
  isInterestGroupActive: false,
};

const renderTabbedCard = (isGroupInactive: boolean) =>
  render(
    <GroupTeamsTabbedCard
      {...props}
      teams={[
        { displayName: 'team 1', id: '123' },
        { displayName: 'team 2', id: '245', inactiveSince: '2021-01-01' },
      ]}
      isInterestGroupActive={isGroupInactive}
    />,
  );

it('splits active and inactive teams', () => {
  renderTabbedCard(true);
  expect(screen.getByRole('heading').textContent).toEqual(
    'Interest Group Teams',
  );
  expect(screen.getByText('Past Teams (1)')).toBeVisible();
  expect(screen.getByText('Active Teams (1)')).toBeVisible();
  expect(screen.getByText(/team 1/)).toBeVisible();

  fireEvent.click(screen.getByText('Past Teams (1)'));
  expect(screen.getByText(/team 2/)).toBeVisible();
});

it('shows all teams as past when group is inactive', () => {
  renderTabbedCard(false);
  expect(screen.getByText('Past Teams (2)')).toBeVisible();
  expect(screen.getByText('Active Teams (0)')).toBeVisible();
  expect(screen.getByText(/team 1/)).toBeVisible();
  expect(screen.getByText(/team 2/)).toBeVisible();
});

it('shows the correct more and less button text', () => {
  render(
    <GroupTeamsTabbedCard
      {...props}
      teams={createListTeamResponse(20).items}
    />,
  );
  fireEvent.click(screen.getByText('View More Teams'));
  expect(screen.getByText(/View Less Teams/)).toBeVisible();
});

it('renders inactive badge for team with endDate in the past', () => {
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const pastDate = new Date(Date.now() - ONE_DAY_IN_MS).toISOString();
  render(
    <GroupTeamsTabbedCard
      {...props}
      teams={[{ displayName: 'Past Team', id: 'past-team', endDate: pastDate }]}
      isInterestGroupActive={true}
    />,
  );
  fireEvent.click(screen.getByText('Past Teams (1)'));

  expect(screen.getByTitle('Inactive Team')).toBeInTheDocument();
  expect(screen.getByText('Past Team')).toBeVisible();
});

it('does not render inactive badge for team with endDate in the future', () => {
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const futureDate = new Date(Date.now() + ONE_DAY_IN_MS).toISOString();
  render(
    <GroupTeamsTabbedCard
      {...props}
      teams={[
        {
          displayName: 'Not ended yet Team',
          id: 'not-ended-yet-team',
          endDate: futureDate,
        },
      ]}
      isInterestGroupActive={true}
    />,
  );
  expect(screen.queryByText('Past Teams (1)')).not.toBeInTheDocument();
  expect(screen.getByText('Active Teams (1)')).toBeVisible();
  expect(screen.getByText('Not ended yet Team')).toBeVisible();
});
