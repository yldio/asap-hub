import React from 'react';
import { render } from '@testing-library/react';

import ProfileBackground from '../ProfileBackground';

it('generates a heading', () => {
  const { getByText } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborator"
      href="/network/teams/42"
    />,
  );
  expect(getByText(/role.on.asap/i).tagName).toBe('H2');
});

it('renders links to team page twice', () => {
  const { getAllByRole } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborator"
      href="/network/teams/42"
    />,
  );

  const links = (getAllByRole('link') as HTMLAnchorElement[]).map(
    ({ href }) => href,
  );
  expect(links).toMatchInlineSnapshot(`
    Array [
      "http://localhost/network/teams/42",
      "http://localhost/network/teams/42",
    ]
  `);
});

it('renders proposal if present', () => {
  const { rerender, queryAllByText } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborator"
      href="/network/teams/42"
    />,
  );

  expect(queryAllByText(/proposal/i)).toHaveLength(0);

  rerender(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborator"
      approach="text"
      href="/network/teams/42"
      proposalHref="/shared-research/uuid"
    />,
  );

  expect(queryAllByText(/proposal/i).length).toBeGreaterThan(0);
});

it('renders responsibilities if present', () => {
  const { rerender, queryAllByText } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborator"
      href="/network/teams/42"
    />,
  );
  expect(queryAllByText(/responsibilities/i)).toHaveLength(0);

  rerender(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborator"
      responsibilities="text"
      href="/network/teams/42"
    />,
  );

  expect(queryAllByText(/responsibilities/i).length).toBeGreaterThan(0);
});

it('renders approach if present', () => {
  const { rerender, queryAllByText } = render(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborator"
      href="/network/teams/42"
    />,
  );

  expect(queryAllByText(/approach/i)).toHaveLength(0);

  rerender(
    <ProfileBackground
      id="42"
      firstName="Phillip"
      displayName="Phillip, M"
      role="Collaborator"
      approach="text"
      href="/network/teams/42"
    />,
  );

  expect(queryAllByText(/interests/i).length).toBeGreaterThan(0);
});
