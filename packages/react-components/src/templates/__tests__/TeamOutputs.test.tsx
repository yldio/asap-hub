import React from 'react';
import { render } from '@testing-library/react';

import TeamOutputs from '../TeamOutputs';

it('renders a coming soon text', () => {
  const { getByText } = render(<TeamOutputs outputs={[]} />);

  expect(getByText(/more\sto\scome/i)).toBeVisible();
  expect(getByText(/research\soutputs/i)).toBeVisible();
});

it('renders output cards', () => {
  const { getAllByRole } = render(
    <TeamOutputs
      outputs={[
        {
          type: 'Proposal',
          id: 'uuid-output',
          created: new Date().toISOString(),
          publishDate: new Date().toISOString(),
          title: 'Title',
          href: '/shared-research/uuid-output',
          team: {
            id: 'uuid-team',
            displayName: 'Unknown',
            href: '/network/teams/uuid-team',
          },
        },
      ]}
    />,
  );

  const links = getAllByRole('link');
  expect(links).toHaveLength(2);
  const [titleLink, teamLink] = links;

  expect(titleLink.textContent).toMatchInlineSnapshot(`"Title"`);
  expect(teamLink.textContent).toMatchInlineSnapshot(`"Team Unknown"`);

  expect(titleLink).toHaveAttribute('href', '/shared-research/uuid-output');
  expect(teamLink).toHaveAttribute('href', '/network/teams/uuid-team');
});
