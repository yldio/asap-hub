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
  userAssociationMember: true,
  workingGroupAssociation: false,
  draftOutputs: false,
  hasOutputs: false,
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

it('renders the no output page for your own team', () => {
  const { getByTitle, getByRole, getByText, rerender } = render(
    <ProfileOutputs {...baseProps} userAssociationMember={true} />,
  );
  expect(getByTitle('Research')).toBeInTheDocument();
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(/Your team/i);
  expect(getByText(/contact your PM/i).closest('a')).toBeNull();
  rerender(
    <ProfileOutputs
      {...baseProps}
      numberOfItems={0}
      numberOfPages={0}
      researchOutputs={[]}
      userAssociationMember={true}
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
    <ProfileOutputs {...baseProps} userAssociationMember={false} />,
  );
  expect(getByTitle('Research')).toBeInTheDocument();
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(/This team/i);
  expect(getByText(/contact the PM/i).closest('a')).toBeNull();
  rerender(
    <ProfileOutputs
      {...baseProps}
      numberOfItems={0}
      numberOfPages={0}
      researchOutputs={[]}
      userAssociationMember={false}
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
      numberOfItems={0}
      numberOfPages={0}
      userAssociationMember={false}
      workingGroupAssociation={true}
      researchOutputs={[]}
    />,
  );

  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /This working group/i,
  );
  rerender(
    <ProfileOutputs
      {...baseProps}
      numberOfItems={0}
      numberOfPages={0}
      userAssociationMember={true}
      researchOutputs={[]}
      workingGroupAssociation={true}
    />,
  );
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /Your working group/i,
  );
});

it('renders the no draft output page for team', () => {
  const { getByRole } = render(
    <ProfileOutputs
      {...baseProps}
      draftOutputs
      userAssociationMember={false}
    />,
  );
  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /This team doesn’t have any draft outputs./i,
  );
});

it('renders the no draft outputs page for a working group', () => {
  const { getByRole } = render(
    <ProfileOutputs
      {...baseProps}
      numberOfItems={0}
      numberOfPages={0}
      draftOutputs
      workingGroupAssociation={true}
      researchOutputs={[]}
    />,
  );

  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /This working group doesn’t have any draft outputs./i,
  );
});

it('renders no results found page when there are outputs but none returned', () => {
  const { getByRole } = render(
    <ProfileOutputs {...baseProps} numberOfItems={0} hasOutputs={true} />,
  );

  expect(getByRole('heading', { level: 1 }).textContent).toMatch(
    /No results have been found/i,
  );
});
