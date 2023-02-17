import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import UserProfileResearchOutputs from '../UserProfileResearchOutputs';

const baseProps: ComponentProps<typeof UserProfileResearchOutputs> = {
  researchOutputs: [],
  numberOfItems: 0,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: () => '',
  isListView: false,
  cardViewHref: '',
  listViewHref: '',
  hasOutputs: true,
  ownUser: true,
  firstName: 'Tess',
};

it('renders output cards', () => {
  const { getAllByRole, queryByText } = render(
    <UserProfileResearchOutputs
      {...baseProps}
      researchOutputs={[
        {
          ...createResearchOutputResponse(),
          id: 'uuid-output',
          title: 'Title',
          authors: [],
          teams: [
            {
              id: 'uuid-team',
              displayName: 'Unknown',
            },
          ],
          workingGroups: [
            {
              id: 'uuid-wg',
              title: 'WG',
            },
          ],
        },
      ]}
      numberOfItems={1}
    />,
  );

  const links = getAllByRole('link');
  expect(links).toHaveLength(3);
  const [titleLink, teamLink, wgLink] = links;

  expect(titleLink).toHaveTextContent('Title');
  expect(teamLink).toHaveTextContent(/Unknown/);
  expect(wgLink).toHaveTextContent(/WG/);

  expect(titleLink).toHaveAttribute(
    'href',
    expect.stringMatching(/uuid-output$/),
  );
  expect(teamLink).toHaveAttribute('href', expect.stringMatching(/uuid-team$/));
  expect(wgLink).toHaveAttribute('href', expect.stringMatching(/uuid-wg$/));

  expect(queryByText(/more\sto\scome/i)).not.toBeInTheDocument();
});

it('renders the no output page for your own user', () => {
  const { getByTitle, getByRole } = render(
    <UserProfileResearchOutputs
      {...baseProps}
      hasOutputs={false}
      ownUser={true}
    />,
  );
  expect(getByTitle('Research')).toBeInTheDocument();
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /You haven’t/i,
  );
});

it('renders the no output page for another user', () => {
  const { getByTitle, getByRole } = render(
    <UserProfileResearchOutputs
      {...baseProps}
      hasOutputs={false}
      ownUser={false}
      firstName="PersonA"
    />,
  );
  expect(getByTitle('Research')).toBeInTheDocument();
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /PersonA hasn’t/i,
  );
});
