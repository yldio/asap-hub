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

  const links = getAllByRole('link') as HTMLAnchorElement[];
  expect(getAllByRole('link')).toHaveLength(2);
  links.forEach((l) => {
    expect(l.href).toContain('/teams/42');
  });
});

it('renders responsabilities if present', () => {
  const { rerender, queryAllByText } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Team Phillip, M"
      role="Collaborator"
    />,
  );
  expect(queryAllByText(/responsabilities/i)).toHaveLength(0);

  rerender(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Team Phillip, M"
      role="Collaborator"
      responsabilities="text"
    />,
  );

  expect(queryAllByText(/responsabilities/i).length).toBeGreaterThan(0);
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
