import React from 'react';
import { render } from '@testing-library/react';

import ProfileBackground from '../ProfileBackground';

it('renders links to team page twice', () => {
  const { getAllByRole } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Team Phillip, M"
      role="Collaborator"
    />,
  );

  const links = (getAllByRole('link') as HTMLAnchorElement[]).map(
    ({ href }) => href,
  );
  expect(links).toMatchInlineSnapshot(`
    Array [
      "http://localhost/teams/42",
      "http://localhost/teams/42",
    ]
  `);
});

it('renders responsibilities if present', () => {
  const { rerender, queryAllByText } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Team Phillip, M"
      role="Collaborator"
    />,
  );
  expect(queryAllByText(/responsibilities/i)).toHaveLength(0);

  rerender(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Team Phillip, M"
      role="Collaborator"
      responsibilities="text"
    />,
  );

  expect(queryAllByText(/responsibilities/i).length).toBeGreaterThan(0);
});

it('renders approach if present', () => {
  const { rerender, queryAllByText } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Team Phillip, M"
      role="Collaborator"
    />,
  );

  expect(queryAllByText(/approach/i)).toHaveLength(0);

  rerender(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Team Phillip, M"
      role="Collaborator"
      approach="text"
    />,
  );

  expect(queryAllByText(/approach/i).length).toBeGreaterThan(0);
});
