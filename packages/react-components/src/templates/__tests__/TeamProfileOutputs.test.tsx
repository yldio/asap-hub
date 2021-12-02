import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import TeamProfileOutputs from '../TeamProfileOutputs';

const baseProps: ComponentProps<typeof TeamProfileOutputs> = {
  researchOutputs: [],
  numberOfItems: 0,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: () => '',
  isListView: false,
  cardViewHref: '',
  listViewHref: '',
  hasOutputs: true,
  ownTeam: true,
};

it('renders output cards', () => {
  const { getAllByRole, queryByText } = render(
    <TeamProfileOutputs
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
        },
      ]}
      numberOfItems={1}
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

  expect(queryByText(/more\sto\scome/i)).not.toBeInTheDocument();
});

it('renders the no output page for your own team', () => {
  const { getByTitle, getByRole, getByText, rerender } = render(
    <TeamProfileOutputs {...baseProps} hasOutputs={false} ownTeam={true} />,
  );
  expect(getByTitle('Research')).toBeInTheDocument();
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(/Your team/i);
  expect(getByText(/contact your PM/i).closest('a')).toBeNull();
  rerender(
    <TeamProfileOutputs
      {...baseProps}
      hasOutputs={false}
      ownTeam={true}
      contactEmail="example@example.com"
    />,
  );
  expect(getByText(/contact your PM/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/example@example/i),
  );
});

it('renders the no output page for another team', () => {
  const { getByTitle, getByRole, getByText, rerender } = render(
    <TeamProfileOutputs {...baseProps} hasOutputs={false} ownTeam={false} />,
  );
  expect(getByTitle('Research')).toBeInTheDocument();
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(/This team/i);
  expect(getByText(/contact the PM/i).closest('a')).toBeNull();
  rerender(
    <TeamProfileOutputs
      {...baseProps}
      hasOutputs={false}
      ownTeam={false}
      contactEmail="example@example.com"
    />,
  );
  expect(getByText(/contact the PM/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/example@example/i),
  );
});
