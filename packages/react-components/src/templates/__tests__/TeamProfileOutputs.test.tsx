import { createResearchOutputResponse } from '@asap-hub/fixtures';
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
          ...createResearchOutputResponse(),
          id: 'uuid-output',
          title: 'Title',
          teams: [
            {
              id: 'uuid-team',
              displayName: 'Unknown',
            },
          ],
        },
      ]}
    />,
  );

  const links = getAllByRole('link');
  expect(links).toHaveLength(2);
  const [titleLink, teamLink] = links;

  expect(titleLink).toHaveTextContent('Title');
  expect(teamLink).toHaveTextContent(/Unknown/);

  expect(titleLink).toHaveAttribute(
    'href',
    expect.stringMatching(/uuid-output$/),
  );
  expect(teamLink).toHaveAttribute('href', expect.stringMatching(/uuid-team$/));
});
