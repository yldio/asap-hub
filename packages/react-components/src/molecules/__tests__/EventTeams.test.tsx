import { createEventResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import EventTeams from '../EventTeams';

it('displays the teams with number of additional teams', () => {
  render(
    <EventTeams
      {...createEventResponse({
        numberOfSpeakers: 10,
        numberOfExternalSpeakers: 0,
        numberOfUnknownSpeakers: 0,
      })}
    />,
  );

  expect(screen.getAllByRole('listitem').length).toEqual(7);
  expect(screen.getByText('+3')).toBeInTheDocument();
});

it('displays the teams', () => {
  render(
    <EventTeams
      {...createEventResponse()}
      speakers={[
        {
          team: {
            displayName: 'one team',
            id: 'team-id',
          },
        },
        {
          team: {
            displayName: 'another team',
            id: 'team-id-1',
          },
        },
      ]}
    />,
  );
  expect(screen.getByText(/one team/i)).toBeInTheDocument();
  expect(screen.getByText(/another team/i)).toBeInTheDocument();
});

it('displays the team only once if it is duplicated', () => {
  render(
    <EventTeams
      {...createEventResponse()}
      speakers={Array.from({ length: 10 }, () => ({
        team: {
          displayName: 'the team',
          id: 'team-id',
        },
      }))}
    />,
  );

  expect(screen.getAllByText(/the team/i).length).toEqual(1);
});

it('do not display the team when there is none', () => {
  render(
    <EventTeams
      {...createEventResponse({
        numberOfSpeakers: 0,
        numberOfExternalSpeakers: 0,
        numberOfUnknownSpeakers: 0,
      })}
    />,
  );

  expect(screen.queryByTitle('Team')).not.toBeInTheDocument();
});

it('displays inactive badge when a team is inactive', () => {
  render(
    <EventTeams
      speakers={[
        {
          team: {
            displayName: 'Team',
            id: '123',
            inactiveSince: '2022-10-20T09:00:00Z',
          },
          user: {
            displayName: 'User',
            id: '123',
          },
        },
      ]}
    />,
  );

  expect(screen.getByTitle('Inactive')).toBeInTheDocument();
});
