import React from 'react';
import { render } from '@testing-library/react';

import TeamsList from '../TeamsList';

it('generates an entry for each team', () => {
  const { getAllByRole } = render(
    <TeamsList
      teams={[
        { displayName: 'One', id: 't0' },
        { displayName: 'Two', id: 't1' },
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
    <TeamsList teams={[{ displayName: 'One', id: 't0' }]} />,
  );
  expect(getByText(/team.one/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/t0$/),
  );
});

describe('in inline mode', () => {
  it('renders one team icon as opposed to one each', () => {
    const { getAllByTitle, rerender } = render(
      <TeamsList
        teams={[
          { displayName: 'One', id: 't0' },
          { displayName: 'Two', id: 't1' },
        ]}
      />,
    );
    expect(getAllByTitle(/team/i)).toHaveLength(2);

    rerender(
      <TeamsList
        inline
        teams={[
          { displayName: 'One', id: 't0' },
          { displayName: 'Two', id: 't1' },
        ]}
      />,
    );
    expect(getAllByTitle(/team/i)).toHaveLength(1);
  });
});
