import React from 'react';
import { render } from '@testing-library/react';
import {
  createListUserResponse,
  createListTeamResponse,
} from '@asap-hub/fixtures';

import GroupMembersSection from '../GroupMembersSection';

it('renders a list of leaders', async () => {
  const { getByText } = render(
    <GroupMembersSection
      leaders={[
        {
          ...createListUserResponse(1).items[0],
          displayName: 'Bat Man',
          role: 'Lead PI - Chair',
          href: '#0',
          teams: [],
        },
        {
          ...createListUserResponse(2).items[1],
          displayName: 'Some One',
          role: 'Project Manager',
          href: '#1',
          teams: [],
        },
      ]}
      teams={[]}
    />,
  );
  expect(getByText('Bat Man').closest('li')).toHaveTextContent(
    'Lead PI - Chair',
  );
  expect(getByText('Some One').closest('li')).toHaveTextContent(
    'Project Manager',
  );
});

it('shows the number of teams', async () => {
  const { getByText } = render(
    <GroupMembersSection
      leaders={[]}
      teams={createListTeamResponse(1).items.map((team) => ({
        ...team,
        href: team.id,
      }))}
    />,
  );
  expect(getByText(/teams/i).textContent).toMatchInlineSnapshot(`"Teams (1)"`);
});
it('renders a list of teams', async () => {
  const { getByText } = render(
    <GroupMembersSection
      teams={[
        {
          ...createListTeamResponse(1).items[0],
          displayName: 'Team 0',
          href: '#0',
        },
        {
          ...createListTeamResponse(2).items[1],
          displayName: 'Team 1',
          href: '#1',
        },
      ]}
      leaders={[]}
    />,
  );
  expect(getByText('Team 0').closest('a')).toHaveAttribute('href', '#0');
  expect(getByText('Team 1').closest('a')).toHaveAttribute('href', '#1');
});
