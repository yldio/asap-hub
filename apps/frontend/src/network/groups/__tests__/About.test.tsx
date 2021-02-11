import React from 'react';
import { render } from '@testing-library/react';
import {
  createGroupResponse,
  createUserResponse,
  createUserTeams,
  createTeamResponse,
} from '@asap-hub/fixtures';

import About from '../About';

it('links to the group leaders', () => {
  const { getByText } = render(
    <About
      groupTeamsElementId="x"
      group={{
        ...createGroupResponse(),
        leaders: [
          {
            role: 'Chair',
            user: {
              ...createUserResponse(),
              id: '42',
              displayName: 'John Doe',
            },
          },
        ],
      }}
    />,
  );
  expect(getByText('John Doe').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/\D42$/),
  );
});

it('links to the group leader teams', () => {
  const { getByText } = render(
    <About
      groupTeamsElementId="x"
      group={{
        ...createGroupResponse(),
        leaders: [
          {
            role: 'Chair',
            user: {
              ...createUserResponse(),
              teams: [
                {
                  ...createUserTeams({ teams: 1 })[0],
                  id: '42',
                  displayName: 'Cool Team',
                },
              ],
            },
          },
        ],
      }}
    />,
  );
  expect(getByText(/cool.team/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/\D42/),
  );
});

it('links to the group teams', () => {
  const { getByText } = render(
    <About
      groupTeamsElementId="x"
      group={{
        ...createGroupResponse(),
        teams: [
          {
            ...createTeamResponse(),
            id: '42',
            displayName: 'Cool Team',
          },
        ],
      }}
    />,
  );
  expect(getByText(/cool.team/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/\D42/),
  );
});

it('assigns given id to the teams section for deep linking', () => {
  const { container } = render(
    <About groupTeamsElementId="group-teams" group={createGroupResponse()} />,
  );
  expect(container.querySelector('#group-teams')).toHaveTextContent(/teams/i);
});
