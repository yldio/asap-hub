import React from 'react';
import { render } from '@testing-library/react';

import TeamPage from '../TeamPage';

const boilerplateProps = {
  id: '42',
  applicationNumber: 'Unknown',
  projectTitle: 'Unknown',
  displayName: 'Doe, J',
  lastModifiedDate: new Date(2020, 6, 12, 14, 32).toISOString(),
  members: [],
  skills: [],
  aboutHref: '#',
  outputsHref: '#',
};

it('renders the header', () => {
  const { getByText } = render(
    <TeamPage {...boilerplateProps}>Tab Content</TeamPage>,
  );
  expect(getByText('Doe, J')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <TeamPage {...boilerplateProps}>Tab Content</TeamPage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
