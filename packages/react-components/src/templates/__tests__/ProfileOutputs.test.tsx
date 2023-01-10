import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';

import ProfileOutputs from '../ProfileOutputs';

const baseProps: ComponentProps<typeof ProfileOutputs> = {
  researchOutputs: [],
  numberOfItems: 0,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: () => '',
  isListView: false,
  cardViewHref: '',
  listViewHref: '',
  hasOutputs: true,
  ownEntity: true,
  publishingEntity: 'Team',
};

it('renders output cards', () => {
  const { getAllByRole, queryByText } = render(
    <ProfileOutputs
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
    <ProfileOutputs {...baseProps} hasOutputs={false} ownEntity={true} />,
  );
  expect(getByTitle('Research')).toBeInTheDocument();
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(/Your team/i);
  expect(getByText(/contact your PM/i).closest('a')).toBeNull();
  rerender(
    <ProfileOutputs
      {...baseProps}
      hasOutputs={false}
      ownEntity={true}
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
    <ProfileOutputs {...baseProps} hasOutputs={false} ownEntity={false} />,
  );
  expect(getByTitle('Research')).toBeInTheDocument();
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(/This team/i);
  expect(getByText(/contact the PM/i).closest('a')).toBeNull();
  rerender(
    <ProfileOutputs
      {...baseProps}
      hasOutputs={false}
      ownEntity={false}
      contactEmail="example@example.com"
    />,
  );
  expect(getByText(/contact the PM/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/example@example/i),
  );
});

it('renders the no outputs page for a working group', () => {
  const { getByRole, rerender } = render(
    <ProfileOutputs
      {...baseProps}
      hasOutputs={false}
      ownEntity={false}
      publishingEntity="Working Group"
    />,
  );

  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /This working group/i,
  );
  rerender(
    <ProfileOutputs
      {...baseProps}
      hasOutputs={false}
      publishingEntity="Working Group"
      ownEntity={true}
    />,
  );
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /Your working group/i,
  );
});
