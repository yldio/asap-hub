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
          avatarURL: 'https://example.com',
          role: 'Colaborator',
        },
      ]}
    />,
  );
  expect(getAllByRole('img')).toHaveLength(1);
});
