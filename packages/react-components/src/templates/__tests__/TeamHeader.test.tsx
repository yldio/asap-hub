import React from 'react';
import { render } from '@testing-library/react';
import { subYears, formatISO } from 'date-fns';
import { createTeamResponseMembers } from '@asap-hub/fixtures';

import TeamHeader from '../TeamHeader';

const boilerplateProps = {
  id: '42',
  displayName: 'John, D',
  projectTitle: 'Unknown',
  applicationNumber: 'Unknown',
  members: [],
  skills: [],
  lastModifiedDate: formatISO(new Date()),
  aboutHref: './about',
  outputsHref: './outputs',
  workspaceHref: './workspace',
};

it('renders the name as the top-level heading', () => {
  const { getByRole } = render(
    <TeamHeader {...boilerplateProps} displayName="John, D" />,
  );

  expect(getByRole('heading')).toHaveTextContent('John, D');
  expect(getByRole('heading').tagName).toBe('H1');
});

it('generates the last updated text', () => {
  const { container } = render(
    <TeamHeader
      {...boilerplateProps}
      lastModifiedDate={formatISO(subYears(new Date(), 2))}
    />,
  );
  expect(container).toHaveTextContent(/update.* 2 years ago/);
});

it('renders a list of members', () => {
  const { getAllByRole } = render(
    <TeamHeader
      {...boilerplateProps}
      members={[
        {
          id: '42',
          displayName: 'Unknown',
          email: 'foo@bar.com',
          avatarUrl: 'https://example.com',
          role: 'Collaborator',
        },
      ]}
    />,
  );
  expect(getAllByRole('img')).toHaveLength(1);
});

it('renders no more than 5 members', () => {
  const { getByLabelText, getAllByLabelText } = render(
    <TeamHeader
      {...boilerplateProps}
      members={createTeamResponseMembers({ teamMembers: 6 })}
    />,
  );
  expect(getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(getByLabelText(/\+1/)).toBeVisible();
});

it('renders a contact button when there is a pointOfContact', () => {
  const { getByText } = render(
    <TeamHeader
      {...boilerplateProps}
      pointOfContact={{
        id: 'uuid',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        role: 'Project Manager',
      }}
    />,
  );

  expect(getByText('Contact PM').parentElement).toHaveAttribute(
    'href',
    'mailto:test@test.com',
  );
});

it('renders tabs', () => {
  const { getAllByRole } = render(<TeamHeader {...boilerplateProps} />);
  expect(getAllByRole('link').map(({ textContent }) => textContent)).toEqual([
    'About',
    'Outputs',
  ]);
});

it('renders workspace tabs when tools provided', () => {
  const { getAllByRole } = render(
    <TeamHeader
      {...boilerplateProps}
      tools={[{ name: '', description: '', url: '' }]}
    />,
  );
  expect(getAllByRole('link').map(({ textContent }) => textContent)).toEqual([
    'About',
    'Team Workspace',
    'Outputs',
  ]);
});
