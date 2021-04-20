import React from 'react';
import { render } from '@testing-library/react';

import TeamProfileOutputs from '../TeamProfileOutputs';

it('renders a coming soon text', () => {
  const { getByText } = render(<TeamProfileOutputs outputs={[]} />);

  expect(getByText(/more\sto\scome/i)).toBeVisible();
  expect(getByText(/research\soutputs/i)).toBeVisible();
});

it('renders output cards', () => {
  const { getAllByRole } = render(
    <TeamProfileOutputs
      outputs={[
        {
          type: 'Proposal',
          id: 'uuid-output',
          created: new Date().toISOString(),
          addedDate: new Date().toISOString(),
          title: 'Title',
          team: {
            id: 'uuid-team',
            displayName: 'Unknown',
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

  expect(titleLink).toHaveAttribute(
    'href',
    expect.stringMatching(/uuid-output$/),
  );
  expect(teamLink).toHaveAttribute('href', expect.stringMatching(/uuid-team$/));
});
