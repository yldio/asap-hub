import React from 'react';
import { render } from '@testing-library/react';

import TeamsList from '../TeamsList';

it('generates an entry for each team', () => {
  const { getAllByRole } = render(
    <TeamsList
      teams={[
        { displayName: 'Team 1', href: '#0' },
        { displayName: 'Team 2', href: '#1' },
      ]}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringContaining('Team 1'),
    expect.stringContaining('Team 2'),
  ]);
});

it('links to the teams', () => {
  const { getByText } = render(
    <TeamsList teams={[{ displayName: 'Team 1', href: '#0' }]} />,
  );
  expect(getByText('Team 1').closest('a')).toHaveAttribute('href', '#0');
});
