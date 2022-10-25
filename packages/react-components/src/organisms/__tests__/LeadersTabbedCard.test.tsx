import { ComponentProps } from 'react';
import { createUserResponse, createUserTeams } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import LeadersTabbedCard from '../LeadersTabbedCard';

const props: ComponentProps<typeof LeadersTabbedCard> = {
  leaders: [],
  title: '',
};
it('renders the leaders tabbed card', () => {
  render(
    <LeadersTabbedCard
      {...props}
      leaders={[
        {
          user: { ...createUserResponse(), displayName: 'Octavian' },
          role: 'Project Manager',
        },
      ]}
      title="Leaders title"
    />,
  );
  expect(screen.getByRole('heading').textContent).toEqual('Leaders title');
  expect(screen.getByText('Past Leaders (1)')).toBeVisible();
  expect(screen.getByText(/Octavian/)).toBeVisible();
  expect(screen.getByText(/Project Manager/)).toBeVisible();
});

it('renders a leader with multiple teams', () => {
  render(
    <LeadersTabbedCard
      {...props}
      leaders={[
        {
          user: {
            ...createUserResponse(),
            displayName: 'Joe',
            teams: createUserTeams({ teams: 2 }),
          },
          role: 'Chair',
        },
      ]}
      title="Leaders title"
    />,
  );
  expect(screen.getByText(/Joe/)).toBeVisible();
  expect(screen.getByText(/Multiple Teams/)).toBeVisible();
});

it('renders a leader with a single team', () => {
  render(
    <LeadersTabbedCard
      {...props}
      leaders={[
        {
          user: {
            ...createUserResponse(),
            displayName: 'Joe',
            teams: [
              {
                displayName: 'Test team',
                role: 'Project Manager',
                id: 'team-id-1',
              },
            ],
          },
          role: 'Project Manager',
        },
      ]}
      title="Leaders title"
    />,
  );
  expect(screen.getByText(/Joe/)).toBeVisible();
  expect(screen.getByText(/Test team/)).toBeVisible();
});
