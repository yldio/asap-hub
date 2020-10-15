import React from 'react';
import { render } from '@testing-library/react';
import { subYears, formatISO } from 'date-fns';

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
          avatarURL: 'https://example.com',
          role: 'Collaborator',
        },
      ]}
    />,
  );
  expect(getAllByRole('img')).toHaveLength(1);
});

it('renders no more than 5 members', () => {
  const { getAllByRole } = render(
    <TeamHeader
      {...boilerplateProps}
      members={[
        {
          id: '1',
          displayName: 'Unknown',
          email: 'foo1@bar.com',
          avatarURL: 'https://example.com',
          role: 'Collaborator',
        },
        {
          id: '2',
          displayName: 'Unknown',
          email: 'foo2@bar.com',
          avatarURL: 'https://example.com',
          role: 'Collaborator',
        },
        {
          id: '3',
          displayName: 'Unknown',
          email: 'foo3@bar.com',
          avatarURL: 'https://example.com',
          role: 'Collaborator',
        },
        {
          id: '4',
          displayName: 'Unknown',
          email: 'foo4@bar.com',
          avatarURL: 'https://example.com',
          role: 'Collaborator',
        },
        {
          id: '5',
          displayName: 'Unknown',
          email: 'foo5@bar.com',
          avatarURL: 'https://example.com',
          role: 'Collaborator',
        },
        {
          id: '6',
          displayName: 'Unknown',
          email: 'foo6@bar.com',
          avatarURL: 'https://example.com',
          role: 'Collaborator',
        },
      ]}
    />,
  );
  expect(getAllByRole('img')).toHaveLength(5);
});

it('renders a contact button when there is a pointOfContact', () => {
  const { getByText } = render(
    <TeamHeader {...boilerplateProps} pointOfContact="test@test.com" />,
  );

  expect(getByText('Contact').parentElement).toHaveAttribute(
    'href',
    'mailto:test@test.com',
  );
});
