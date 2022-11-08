import { ComponentProps } from 'react';
import { createUserResponse, createUserTeams } from '@asap-hub/fixtures';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupLeadersTabbedCard from '../GroupLeadersTabbedCard';

const props: ComponentProps<typeof GroupLeadersTabbedCard> = {
  leaders: [],
  title: '',
  isGroupInactive: false,
};

describe('renders the leaders tabbed card', () => {
  const renderTabbedCard = (isGroupInactive: boolean) =>
    render(
      <GroupLeadersTabbedCard
        {...props}
        leaders={[
          {
            user: {
              ...createUserResponse(),
              displayName: 'Active Leader Name',
            },
            role: 'Chair',
          },
          {
            user: {
              ...createUserResponse(),
              displayName: 'Alumni Leader Name',
              alumniSinceDate: '2021-01-01',
            },
            role: 'Project Manager',
          },
        ]}
        title="Leaders title"
        isGroupInactive={isGroupInactive}
      />,
    );

  it('renders for an Active Group', () => {
    renderTabbedCard(false);
    expect(screen.getByRole('heading').textContent).toEqual('Leaders title');
    expect(screen.getByText('Past Leaders (1)')).toBeVisible();
    expect(screen.getByText('Active Leaders (1)')).toBeVisible();
    expect(screen.getByText(/Active Leader Name/)).toBeVisible();
    expect(screen.getByText(/Chair/)).toBeVisible();

    fireEvent.click(screen.getByText('Past Leaders (1)'));
    expect(screen.getByText(/Alumni Leader Name/)).toBeVisible();
    expect(screen.getByText(/Project Manager/)).toBeVisible();
  });

  it('renders for an Inactive Group', () => {
    renderTabbedCard(true);
    expect(screen.getByText('Past Leaders (2)')).toBeVisible();
    expect(screen.getByText('Active Leaders (0)')).toBeVisible();
    expect(screen.getByText(/Active Leader Name/)).toBeVisible();
    expect(screen.getByText(/Chair/)).toBeVisible();
    expect(screen.getByText(/Alumni Leader Name/)).toBeVisible();
    expect(screen.getByText(/Project Manager/)).toBeVisible();
  });
});

it('renders a leader with multiple teams', () => {
  render(
    <GroupLeadersTabbedCard
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
    <GroupLeadersTabbedCard
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
    />,
  );
  expect(screen.getByText(/Joe/)).toBeVisible();
  expect(screen.getByText(/Test team/)).toBeVisible();
});
