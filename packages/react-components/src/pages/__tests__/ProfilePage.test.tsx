import React from 'react';
import { render } from '@testing-library/react';

import ProfilePage from '../ProfilePage';

const boilerplateProps = {
  displayName: 'John Doe',
  teams: [],
  skills: [],
  aboutHref: '#',
  outputsHref: '#',
  researchInterestsHref: '#',
};
it('renders the header', () => {
  const { getByText } = render(
    <ProfilePage {...boilerplateProps} tab="about" displayName="John Doe" />,
  );
  expect(getByText('John Doe')).toBeVisible();
});

it('renders the about tab', () => {
  const { getByText } = render(
    <ProfilePage {...boilerplateProps} tab="about" biography="Bio text" />,
  );
  expect(getByText('Bio text')).toBeVisible();
});

it('renders the research interests tab', () => {
  const { getByText } = render(
    <ProfilePage {...boilerplateProps} tab="researchInterests" />,
  );
  expect(getByText(/Research Interests here/)).toBeVisible();
});

it('renders the outputs tab', () => {
  const { getByText } = render(
    <ProfilePage {...boilerplateProps} tab="outputs" />,
  );
  expect(getByText(/Outputs here/)).toBeVisible();
});
