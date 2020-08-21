import React from 'react';
import { render } from '@testing-library/react';

import ProfilePage from '../ProfilePage';

const boilerplateProps = {
  displayName: 'John Doe',
  teams: [],
  skills: [],
  orcidWorks: [],
  aboutHref: '#',
  outputsHref: '#',
  researchInterestsHref: '#',
};
it('renders the header', () => {
  const { getByText } = render(
    <ProfilePage {...boilerplateProps} displayName="John Doe">
      Tab Content
    </ProfilePage>,
  );
  expect(getByText('John Doe')).toBeVisible();
});

it('renders the children', () => {
  const { getByText } = render(
    <ProfilePage {...boilerplateProps}>Tab Content</ProfilePage>,
  );
  expect(getByText('Tab Content')).toBeVisible();
});
