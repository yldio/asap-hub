import React from 'react';
import { render } from '@testing-library/react';
import { createTeamResponse } from '@asap-hub/fixtures';

import TeamWorkspace from '../TeamWorkspace';

const team = createTeamResponse({ teamMembers: 1, tools: 0 });
it('renders the team workspace page', () => {
  const { getByRole } = render(<TeamWorkspace {...team} tools={[]} />);

  expect(getByRole('heading').textContent).toEqual('Team Collaboration Tools');
});

it('renders contact project manager when point of contact provided', () => {
  const { getByText } = render(
    <TeamWorkspace
      {...team}
      pointOfContact={{
        displayName: 'Mr PM',
        email: 'test@example.com',
        id: '123',
        role: 'Project Manager',
      }}
    />,
  );

  const link = getByText('Mr PM', {
    selector: 'a',
  }) as HTMLAnchorElement;

  expect(link.href).toContain('test@example.com');
  expect(getByText('Team Contact Email')).toBeVisible();
});

it('omits contact project manager when point of contact omitted', () => {
  const { queryByText } = render(
    <TeamWorkspace {...team} pointOfContact={undefined} />,
  );

  expect(queryByText('Team Contact Email')).toBe(null);
});

it('Renders tools when provided', () => {
  const { getByText } = render(
    <TeamWorkspace
      {...team}
      tools={[
        {
          name: 'Mr Trump',
          description: 'The President',
          url: 'https://www.whitehouse.gov',
        },
      ]}
    />,
  );

  expect(getByText('Mr Trump')).toBeVisible();
});
