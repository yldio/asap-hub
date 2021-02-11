import React from 'react';
import { render } from '@testing-library/react';

import TeamsList from '../TeamsList';

it('generates an entry for each team', () => {
  const { getAllByRole } = render(
    <TeamsList
      teams={[
        { displayName: 'One', href: '#0' },
        { displayName: 'Two', href: '#1' },
      ]}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    expect.stringContaining('Team One'),
    expect.stringContaining('Team Two'),
  ]);
});

it('links to the teams', () => {
  const { getByText } = render(
    <TeamsList teams={[{ displayName: 'One', href: '#0' }]} />,
  );
  expect(getByText(/team.one/i).closest('a')).toHaveAttribute('href', '#0');
});
