import React from 'react';
import { render } from '@testing-library/react';
import { subYears, formatISO } from 'date-fns';
import { createTeamResponseMembers } from '@asap-hub/fixtures';

import TeamProfileHeader from '../TeamProfileHeader';

const boilerplateProps = {
  id: '42',
  displayName: 'John, D',
  projectTitle: 'Unknown',
  applicationNumber: 'Unknown',
  members: [],
  skills: [],
  outputs: [],
  lastModifiedDate: formatISO(new Date()),
  aboutHref: './about',
  outputsHref: './outputs',
  workspaceHref: './workspace',
};

it('renders the name as the top-level heading', () => {
  const { getByRole } = render(
    <TeamProfileHeader {...boilerplateProps} displayName="John, D" />,
  );

  expect(getByRole('heading')).toHaveTextContent('John, D');
  expect(getByRole('heading').tagName).toBe('H1');
});

it('generates the last updated text', () => {
  const { container } = render(
    <TeamProfileHeader
      {...boilerplateProps}
      lastModifiedDate={formatISO(subYears(new Date(), 2))}
    />,
  );
  expect(container).toHaveTextContent(/update.* 2 years ago/);
});

it('renders a list of members', () => {
  const { getAllByRole } = render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={[
        {
          id: '42',
          displayName: 'Unknown',
          email: 'foo@bar.com',
          avatarUrl: 'https://example.com',
          role: 'Collaborating PI',
        },
      ]}
    />,
  );
  expect(getAllByRole('img')).toHaveLength(1);
});

it('renders no more than 5 members', () => {
  const { getByLabelText, getAllByLabelText } = render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={createTeamResponseMembers({ teamMembers: 6 })}
    />,
  );
  expect(getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(getByLabelText(/\+1/)).toBeVisible();
});

it('renders a contact button when there is a pointOfContact', () => {
  const { getByText } = render(
    <TeamProfileHeader
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
  const { getAllByRole } = render(<TeamProfileHeader {...boilerplateProps} />);
  expect(getAllByRole('link').map(({ textContent }) => textContent)).toEqual([
    'About',
    'Outputs',
  ]);
});

it('renders workspace tabs when tools provided', () => {
  const { getAllByRole } = render(
    <TeamProfileHeader
      {...boilerplateProps}
      tools={[{ name: '', description: '', url: '', href: '' }]}
    />,
  );
  expect(getAllByRole('link').map(({ textContent }) => textContent)).toEqual([
    'About',
    'Team Workspace',
    'Outputs',
  ]);
});
